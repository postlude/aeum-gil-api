# [에움길 API](aeum-gil.com)

## 환경
- Node.js `v20.12.0`
- MySQL `8.0.37`

## 로컬 실행
- local.env 파일 참조
- `yarn start:dev` 실행
- localhost:3000 으로 api 호출

## DDL

<details close>
	<summary>page</summary>
	
	CREATE TABLE page
	(
		id          int unsigned AUTO_INCREMENT
			PRIMARY KEY,
		description varchar(300)                       NULL COMMENT '페이지 설명',
		title       varchar(200)                       NOT NULL COMMENT '제목',
		content     text                               NOT NULL COMMENT '본문',
		created_at  datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at  datetime DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
	)
		COMMENT '페이지';
</details>
<details close>
	<summary>choice_option</summary>
	
	CREATE TABLE choice_option
	(
		id           int unsigned AUTO_INCREMENT
			PRIMARY KEY,
		page_id      int unsigned                       NOT NULL COMMENT '선택지가 속한 페이지 id',
		next_page_id int unsigned                       NULL COMMENT '선택지 선택시 이동할 다음 페이지 id',
		order_num    tinyint unsigned                   NOT NULL COMMENT '선택지 순서',
		content      varchar(300)                       NOT NULL COMMENT '내용',
		created_at   datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at   datetime DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
		CONSTRAINT choice_option_page_id_fk
			FOREIGN KEY (page_id) REFERENCES page (id)
				ON DELETE CASCADE,
		CONSTRAINT choice_option_page_id_fk_2
			FOREIGN KEY (next_page_id) REFERENCES page (id)
				ON DELETE CASCADE
	)
		COMMENT '선택지';
</details>