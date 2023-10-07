home_work nones
student-62 lapenok.vova@gmail.com
так можно чекнуть эндпоинт
curl --header 'Host: weather-api.sre-cource.lapenok' 91.185.85.213/healthz/ready
БД создана, миграции проведены
ендпоинт в секрете



changes in ansible play:
	pgbouncer_install: false #у нас в схеме роль балансера отдана приклад, он умеет в коннекшен пуллер, поэтому pg_balancer здесь избыточен
	with_haproxy_load_balancing: true # install and configure the load-balancing
	postgresql_pg_hba:
		- { type: "host", database: "all", user: "all", address: "10.0.10.0/24", method: "{{ postgresql_password_encryption_algorithm }}" } #allow all local connections


  changes in helm:
