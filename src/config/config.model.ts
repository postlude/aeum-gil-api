export interface MySqlConfig {
	MYSQL_HOST: string
	MYSQL_PORT: number
	MYSQL_USERNAME: string
	MYSQL_PASSWORD: string
	MYSQL_DATABASE: string
}

export interface AWSConfig {
	AWS_ACCESS_KEY_ID: string
	AWS_SECRET_ACCESS_KEY: string
}

export interface DiscordWebhook {
	WEBHOOK_URL: string
}

export interface JwtConfig {
	JWT_SECRET: string
}

export const JwtExpiration = process.env.NODE_ENV === 'production' ? '1d' : '100y';