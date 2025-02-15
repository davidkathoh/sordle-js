import { Storage, Bucket, File } from '@google-cloud/storage';
import * as path from 'path';

interface UploadResult {
  filename: string;
  publicUrl: string;
}

interface SvgDimensions {
  letterWidth: number;
  letterGap: number;
  padding: number;
  totalWidth: number;
  height: number;
}

class CloudStorageUploader {
  private storage: Storage;
  private bucket: Bucket;

  constructor(keyFilename: string, bucketName: string) {
    this.storage = new Storage({
      keyFilename
    });
    this.bucket = this.storage.bucket(bucketName);
  }

  private calculateDimensions(word: string): SvgDimensions {
    const letterWidth = 80;
    const letterGap = 10;
    const padding = 40;
    const totalWidth = (word.length * letterWidth) + ((word.length - 1) * letterGap) + (padding * 2);
    const height = letterWidth + (padding * 2);

    return {
      letterWidth,
      letterGap,
      padding,
      totalWidth,
      height
    };
  }

  private generateSvg(word: string, dimensions: SvgDimensions): string {
    const { letterWidth, letterGap, padding, totalWidth, height } = dimensions;

    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 ${totalWidth} ${height}"
  width="${totalWidth}"
  height="${height}"
>
  <!-- Main Background -->
  <rect 
    width="100%" 
    height="100%" 
    fill="#fff"
  />
  
  <!-- White Container Background -->
  <rect
    x="20"
    y="20"
    width="${totalWidth - 40}"
    height="${height - 40}"
    fill="white"
    rx="15"
    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
  />

  <!-- Letters -->
  ${word.split('').map((letter, index) => {
    const x = padding + (index * (letterWidth + letterGap));
    const y = padding;
    return `
  <g transform="translate(${x},${y})">
    <!-- Letter Background -->
    <rect 
      width="${letterWidth}" 
      height="${letterWidth}" 
      rx="10" 
      fill="#4CAF50"
    />
    <!-- Letter Text -->
    <text 
      x="${letterWidth/2}" 
      y="${letterWidth/2}" 
      font-family="Arial, sans-serif" 
      font-size="36" 
      font-weight="bold" 
      fill="white" 
      text-anchor="middle" 
      dominant-baseline="middle"
      letter-spacing="0"
    >${letter}</text>
  </g>`
  }).join('\n')}
</svg>`;
  }

  public async uploadToGoogleCloud(word: string = 'PUZZLE'): Promise<UploadResult> {
    try {
      const dimensions = this.calculateDimensions(word);
      const svg = this.generateSvg(word, dimensions);

      const filename = `images/${word.toLowerCase()}.svg`;
      const file: File = this.bucket.file(filename);

      await file.save(svg, {
        contentType: 'image/svg+xml',
        metadata: {
          contentType: 'image/svg+xml',
          cacheControl: 'public, max-age=31536000'
        }
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filename}`;
      console.log('File uploaded successfully!');
      console.log('File path:', filename);
      console.log('URL:', publicUrl);
      
      return {
        filename,
        publicUrl
      };

    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

// Usage
export const uploader = new CloudStorageUploader(
    path.resolve(process.cwd(), 'key.json'),
  'sordle'
);

// uploader.uploadToGoogleCloud('PUZZLE')
//   .then((result: UploadResult) => {
//     console.log('Upload successful!');
//     console.log('File location:', result.filename);
//     console.log('Access URL:', result.publicUrl);
//   })
//   .catch((error: Error) => {
//     console.error('Upload failed:', error.message);
//   });