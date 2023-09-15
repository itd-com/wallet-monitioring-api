# metanet-bank-gateway-api

---

## Require
- deviceId: Device ID เจนผ่านลิ้งก์ https://deviceid.scum.in.th/ หรือ SRC ใน ADDON
- pin: รหัสผ่านหน้าเข้าแอป
- phone: เบอร์มือถือ
- encrypt: หากมีของตัวเองก็ใส่ถ้าไม่มี Default http://home.opecgame.in.th:3412/pin/encrypt
- accountNo: บัญชีตัวเอง (Only SCB)
- https://www.scb.co.th/en/personal-banking/digital-banking/scb-easy/how-to/qrcode.html

> **Prerequisites:**
### Nodejs Version 16

You can use `nvm` for dynamic version control

```sh
brew install nvm
nvm install v16.20
brew install yarn
```

### How to Start
```sh
cp -R .env.example .env
yarn install
make db.up
yarn migrate
yarn seed

yarn dev
```

### How to Start from docker
```sh
cp -R .env.example .env
yarn install
make db.up
yarn migrate
yarn seed

docker compose up -d --build
```

### How to run seed specific 
```sh
yarn knex seed:run --specific=seed-filename.js
```


### Api docs
- [http://0.0.0.0:8080/api/docs](http://0.0.0.0:8080/api/docs)

### How to reset DB
```sh
make db.clean
make db.up
```

### Doc Others

fastify Schema

> [https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/](https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/)

Example:

```js
const bodyJsonSchema = {
	type: 'object',
	required: ['requiredKey'],
	properties: {
		someKey: { type: 'string' },
		someOtherKey: { type: 'number' },
		requiredKey: {
			type: 'array',
			maxItems: 3,
			items: { type: 'integer' },
		},
		nullableKey: { type: ['number', 'null'] },
		multipleTypesKey: { type: ['boolean', 'number'] },
		multipleRestrictedTypesKey: {
			oneOf: [
				{ type: 'string', maxLength: 5 },
				{ type: 'number', minimum: 10 },
			],
		},
		enumKey: {
			type: 'string',
			enum: ['John', 'Foo'],
		},
		notTypeKey: {
			not: { type: 'array' },
		},
	},
};

const queryStringJsonSchema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		excitement: { type: 'integer' },
	},
};

const paramsJsonSchema = {
	type: 'object',
	properties: {
		par1: { type: 'string' },
		par2: { type: 'number' },
	},
};

const headersJsonSchema = {
	type: 'object',
	properties: {
		'x-foo': { type: 'string' },
	},
	required: ['x-foo'],
};

const schema = {
	description: 'api_description',
	tags: ['domain_name'],
	summary: 'api_action',
	body: bodyJsonSchema,
	querystring: queryStringJsonSchema,
	params: paramsJsonSchema,
	headers: headersJsonSchema,
	response: {
		200: {
			description: 'Successful Response',
			type: 'object',
			properties: {
				id: { type: 'number', example: 1 },
			},
		},
		422: response['422'],
		500: response['500'],
	},
};

fastify.post(
	'/the/url',
	{
		schema: schema,
		attachValidation: true, // check validation
		preHandler: [
			CommonValidator.postValidator, // if validation error response 422
		],
	},
	controller,
);
```