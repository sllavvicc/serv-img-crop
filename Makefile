## make bootstrap-up
bootstrap-up:
	docker-compose -f docker-compose.local.yml --project-name gtl-zozoboom up --build -d
## make bootstrap-down
bootstrap-down:
	docker-compose -f docker-compose.local.yml down