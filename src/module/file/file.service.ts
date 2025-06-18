import { Injectable } from '@nestjs/common';
import { ImageType } from './file.model';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { AWSConfig } from 'src/config/config.model';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileService {
	constructor(
		private configService: ConfigService<AWSConfig>
	) {
		let accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID', { infer: true });
		let secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY', { infer: true });

		if (!accessKeyId || !secretAccessKey) {
			if (process.env.NODE_ENV === 'local') {
				accessKeyId = '';
				secretAccessKey = '';
			} else {
				throw new Error('AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is not set');
			}
		}

		this.s3Client = new S3Client({
			region: 'ap-northeast-2',
			credentials: {
				accessKeyId,
				secretAccessKey
			}
		});
	}

	private s3Client: S3Client;
	private readonly PRESIGNED_URL_EXPIRES = 3 * 60; // 3분
	private readonly S3_BUCKET = 'static.aeum-gil.com';

	public async getPresignedUrl(fileName: string, imageType: ImageType) {
		const uploadPath = this.getUploadPath(fileName, imageType);

		const command = new PutObjectCommand({
			Bucket: this.S3_BUCKET,
			Key: uploadPath,
		});

		return await getSignedUrl(this.s3Client, command, {
			expiresIn: this.PRESIGNED_URL_EXPIRES
		});
	}

	private getUploadPath(fileName: string, imageType: ImageType) {
		const datePrefix = dayjs().format('YYYYMMDD_HHmmss');
		return `image/${imageType}/${datePrefix}_${fileName}`;
	}
}
