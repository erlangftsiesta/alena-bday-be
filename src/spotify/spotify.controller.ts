import { Controller, Get, Param, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('preview/:id')
  async getPreview(@Param('id') trackId: string) {
    const previewUrl =
      await this.spotifyService.getPreviewUrlFromEmbed(trackId);
    return { previewUrl };
  }

  @Get('search')
  async searchTracks(@Query('q') query: string) {
    if (!query) {
      return { message: 'Query is required (use ?q=your+query)' };
    }

    const results = await this.spotifyService.searchTracksWithPreview(query);
    return results;
  }
}
