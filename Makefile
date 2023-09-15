.PHONY: init
init:
	cp -R .env.example .env

# Start database
db.up:
	docker compose -f docker-compose.db.yml up -d
	for number in 1 2 3 4 5 6; do \
        echo $$number ; \
        sleep 1 ; \
    done

db.down:
	docker compose -f docker-compose.db.yml down

# remove database data
db.clean:
	docker volume rm bank_gateway_volume


seed.admin:
	yarn knex seed:run --specific=20230311000050_add_account_0_admin.js

# run seed
seed.sunnycraft.ta:
	yarn knex seed:run --specific=20230311000050_add_sunnycraft_account_sunnycraft_ta_seed.js

seed.sunnycraft.toei:
	yarn knex seed:run --specific=20230311000050_add_sunnycraft_account_sunnycraft_toei_seed.js

seed.ta:
	yarn knex seed:run --specific=20230311000050_add_account_1_ta.js

seed.cpay:
	yarn knex seed:run --specific=20230311000050_add_account_2_cpay.js