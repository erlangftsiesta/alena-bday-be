import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';

@Injectable()
export class SpotifyService {
  private clientId = process.env.SPOTIFY_CLIENT_ID;
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  private accessToken: string;

  constructor(private readonly httpService: HttpService) {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    const data = qs.stringify({ grant_type: 'client_credentials' });

    const headers = {
      Authorization:
        'Basic ' +
        Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await firstValueFrom(
      this.httpService.post('https://accounts.spotify.com/api/token', data, {
        headers,
      }),
    );

    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  async getPreviewUrlFromEmbed(trackId: string): Promise<string | null> {
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(embedUrl, {
          responseType: 'text', // Penting: agar response tidak di-parse sebagai JSON
        }),
      );

      const content = response.data as string;
      const match = content.match(/"audioPreview":\{"url":"(.*?)"\}/);

      return match ? match[1] : null;
    } catch (error) {
      console.error('Error fetching preview from embed:', error.message);
      throw new HttpException('Failed to fetch preview URL', 500);
    }
  }

  async searchTracksWithPreview(query: string): Promise<any[]> {
    const token = await this.getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };

    const response = await firstValueFrom(
      this.httpService.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&market=ID&limit=10`,
        { headers },
      ),
    );

    const items = response.data.tracks.items;
    let id: number = 1;
    console.log(id)

    const results = await Promise.all(
      items.map(async (track: any, id: number) => {
        let previewUrl = track.preview_url;

        // Fallback: kalau null, coba ambil dari embed
        if (!previewUrl) {
          previewUrl = await this.getPreviewUrlFromEmbed(track.id);
        }

        return {
          id: id + 1,
          title: track.name,
          artist: track.artists.map((a: any) => a.name).join(', '),
          image: track.album.images?.[1]?.url || null,
          previewUrl,
        };
      }),
    );

    return results;
  }
}
