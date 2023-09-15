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
	rm -rf mysql_data