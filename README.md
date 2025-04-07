# [에움길 API](http://aeum-gil.com)

## 환경
- Node.js `v20.12.0`
- MySQL `8.0.37`

## 로컬 실행
- local.env 파일 참조
  - /files/presigned-url GET api를 로컬에서 사용하기 위해선 .env에 aws key 설정 필요
- `yarn start:dev` 실행
- localhost:3000 으로 api 호출

## DDL

<details close>
	<summary>chapter</summary>
	
	create table chapter (
		id            int unsigned auto_increment primary key,
		title         varchar(50)                        null comment '챕터 제목',
		image         varchar(400)                       not null comment '배경 이미지',
		first_page_id int unsigned                       null comment '챕터의 첫 번째 page.id',
		created_at    datetime default CURRENT_TIMESTAMP not null,
		updated_at    datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
		constraint chapter_page_id_fk
			foreign key (first_page_id) references page (id)
	) comment '챕터';
</details>
<details close>
	<summary>page</summary>
	
	CREATE TABLE page (
		id          int unsigned AUTO_INCREMENT PRIMARY KEY,
		chapter_id int unsigned                       null,
		place      varchar(30)                        not null comment '장소',
		content     text                               NOT NULL COMMENT '본문',
		created_at  datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at  datetime DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
		constraint page_chapter_id_fk
			foreign key (chapter_id) references chapter (id)
	) COMMENT '페이지';
</details>
<details close>
	<summary>choice_option</summary>
	
	CREATE TABLE choice_option (
		id           int unsigned AUTO_INCREMENT PRIMARY KEY,
		page_id      int unsigned                       NOT NULL COMMENT '선택지가 속한 페이지 id',
		move_target_type tinyint unsigned                   null comment '1: 페이지, 2: 엔딩',
		target_id        int unsigned                       null comment '다음 페이지 id or 엔딩 id',
		order_num    tinyint unsigned                   NOT NULL COMMENT '선택지 순서',
		content      varchar(300)                       NOT NULL COMMENT '내용',
		created_at   datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at   datetime DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
		CONSTRAINT choice_option_page_id_fk
			FOREIGN KEY (page_id) REFERENCES page (id)
				ON DELETE CASCADE,
	) COMMENT '선택지';

	create index choice_option_target_id_index
    	on choice_option (target_id);
</details>
<details close>
	<summary>item</summary>
	
	CREATE TABLE item (
		id          int unsigned AUTO_INCREMENT PRIMARY KEY,
		name        varchar(100)                       NOT NULL,
		description varchar(200)                       NOT NULL COMMENT '설명',
		importance  tinyint unsigned                   NOT NULL COMMENT '중요도',
		image       varchar(400)                       NOT NULL,
		created_at  datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at  datetime DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
	) COMMENT '아이템';
</details>
<details close>
	<summary>choice_option_item_mapping</summary>

	CREATE TABLE choice_option_item_mapping (
		choice_option_id int unsigned                       NOT NULL,
		item_id          int unsigned                       NOT NULL,
		action_type      tinyint unsigned                   not null comment '1: 획득, 2: 소모, 3: 랜덤 획득',
		created_at       datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at       datetime DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (choice_option_id, item_id),
		CONSTRAINT choice_option_item_mapping_choice_option_id_fk
			FOREIGN KEY (choice_option_id) REFERENCES choice_option (id)
				ON DELETE CASCADE,
		CONSTRAINT choice_option_item_mapping_item_id_fk
			FOREIGN KEY (item_id) REFERENCES item (id)
				ON DELETE CASCADE
	) COMMENT '선택지-아이템 매핑';
</details>
<details close>
	<summary>ending</summary>

	create table ending (
		id          int unsigned auto_increment primary key,
		title       varchar(200)                       not null comment '제목',
		content     text                               not null comment '본문',
		order_num   tinyint unsigned                   not null comment '엔딩 순서',
		return_page_id int unsigned                    not null comment '엔딩 후 되돌아갈 page.id',
		created_at  datetime default CURRENT_TIMESTAMP not null,
		updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
		constraint ending_uq
			unique (order_num)
		constraint ending_page_id_fk
			foreign key (return_page_id) references page (id)
	) comment '엔딩';
</details>
<details close>
	<summary>user</summary>

	create table user (
		id         int unsigned auto_increment primary key,
		name       varchar(50)                        not null,
		password   varchar(500)                       not null,
		created_at datetime default (now())           not null,
		updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
		constraint user_uq unique (name)
	) comment '유저';
</details>
<details close>
	<summary>play_record</summary>

	create table play_record (
		user_id    int unsigned                       not null,
		page_id    int unsigned                       not null,
		detail_log json                               not null comment '상세 기록',
		created_at datetime default CURRENT_TIMESTAMP not null,
		updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
		primary key (user_id, page_id),
		constraint play_record_page_id_fk
			foreign key (page_id) references page (id)
				on delete cascade,
		constraint play_record_user_id_fk
			foreign key (user_id) references user (id)
				on delete cascade
	) comment '플레이 기록';

	create index play_record_updated_at_index
		on play_record (updated_at desc);
</details>
<details close>
	<summary>play_status</summary>

	create table play_status (
		user_id          int unsigned                       not null primary key,
		move_target_type tinyint unsigned                   not null comment '1: 페이지, 2: 엔딩',
		target_id        int unsigned                       not null comment '다음 페이지 id or 엔딩 id',
		owned_items      json                               null comment '현재 소유한 아이템 정보',
		created_at       datetime default CURRENT_TIMESTAMP not null,
		updated_at       datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
		constraint play_status_user_id_fk
			foreign key (user_id) references user (id)
				on delete cascade
	) comment '유저의 현재 플레이 상태';

	create index play_status_target_id_index
		on play_status (target_id);
</details>
<details close>
	<summary>ending_record</summary>

	create table ending_record (
		user_id    int unsigned                       not null,
		ending_id  int unsigned                       not null,
		created_at datetime default CURRENT_TIMESTAMP not null,
		updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
		primary key (user_id, ending_id),
		constraint ending_record_ending_id_fk
			foreign key (ending_id) references ending (id)
				on delete cascade,
		constraint ending_record_user_id_fk
			foreign key (user_id) references user (id)
				on delete cascade
	) comment '엔딩 기록';
</details>