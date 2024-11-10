FROM node:20

ENV SERVER_HOME /usr/src/aeum-gil-api

RUN mkdir -p ${SERVER_HOME}

COPY .. ${SERVER_HOME}

WORKDIR ${SERVER_HOME}

RUN yarn \
	&& yarn build

CMD ["yarn", "start:prod"]