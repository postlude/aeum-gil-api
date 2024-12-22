import { Injectable } from '@nestjs/common';
import { ImageType } from './file.model';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { AWSConfig } from 'src/config/config.model';

@Injectable()
export class FileService {
	constructor(
		private configService: ConfigService<AWSConfig>
	) {
		const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID', { infer: true });
		const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY', { infer: true });

		this.s3 = new AWS.S3({
			accessKeyId,
			secretAccessKey,
			region: 'ap-northeast-2'
		});
	}

	private s3: AWS.S3;
	private readonly PRESIGNED_URL_EXPIRES = 3 * 60; // 3분
	private readonly S3_BUCKET = 'static.aeum-gil.com';

	public async getPresignedUrl(fileName: string, imageType: ImageType) {
		const uploadPath = this.getUploadPath(fileName, imageType);

		return await this.s3.getSignedUrlPromise('putObject', {
			Bucket: this.S3_BUCKET,
			Key: uploadPath,
			Expires: this.PRESIGNED_URL_EXPIRES
		});
	}

	private getUploadPath(fileName: string, imageType: ImageType) {
		const datePrefix = dayjs().format('YYYYMMDD_HHmmss');
		return `image/${imageType}/${datePrefix}_${fileName}`;
	}
}
