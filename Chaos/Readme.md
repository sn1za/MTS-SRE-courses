## Эксперимент 1: Отключение узла
1. Описание эксперимента
Инструменты и методы: Используем команду для остановки PostgreSQL на выбранном узле.
``systemctl stop patroni.service``
2. Ожидаемые результаты
План реакции системы: Ожидаем, что Patroni обнаружит отключенный узел, выберет новый Master и перенаправит трафик. После включения, произойдёт возвращение роли мастера выключенному серверу.
Ожидаемое время восстановления: Планируем, что восстановление должно занять не более 1 минуты.
3. Реальные результаты
лог при отключении мастера
2023-12-10 22:28:13 MSK [10337-2]  LOG:  replication terminated by primary server
2023-12-10 22:28:13 MSK [10337-3]  DETAIL:  End of WAL reached on timeline 1 at 0/B0000A0.
2023-12-10 22:28:13 MSK [10337-4]  FATAL:  could not send end-of-streaming message to primary: server closed the connection unexpectedly
                This probably means the server terminated abnormally
                before or while processing the request.
        no COPY in progress
2023-12-10 22:28:13 MSK [10336-5]  LOG:  invalid record length at 0/B0000A0: wanted 24, got 0
2023-12-10 22:28:14 MSK [604766-1]  FATAL:  could not connect to the primary server: connection to server at "10.0.10.6", port 5432 failed: server closed the connection unexpectedly
                This probably means the server terminated abnormally
                before or while processing the request.
2023-12-10 22:28:14 MSK [10336-6]  LOG:  waiting for WAL to become available at 0/B0000B8
2023-12-10 22:28:15 MSK [10336-7]  LOG:  received promote request
2023-12-10 22:28:15 MSK [10336-8]  LOG:  redo done at 0/B000028 system usage: CPU: user: 18.73 s, system: 23.59 s, elapsed: 5565388.69 s
2023-12-10 22:28:15 MSK [10336-9]  LOG:  last completed transaction was at log time 2023-12-04 21:16:59.224302+03
2023-12-10 22:28:15 MSK [10336-10]  LOG:  selected new timeline ID: 2
2023-12-10 22:28:15 MSK [10336-11]  LOG:  archive recovery complete
2023-12-10 22:28:15 MSK [10334-33]  LOG:  checkpoint starting: force
2023-12-10 22:28:15 MSK [10331-8]  LOG:  database system is ready to accept connections
2023-12-10 22:28:15 MSK [10334-34]  LOG:  checkpoint complete: wrote 2 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.002 s, sync=0.001 s, total=0.009 s; sync files=2, longest=0.001 s, average=0.001 s; distance=16379 kB, estimate=17197 kB

лог при восстановлении мастера
2023-12-10 22:30:52 MSK [605232-1] 10.0.10.6(53714) replicator@[unknown] ERROR:  replication slot "db_01" does not exist
2023-12-10 22:30:52 MSK [605232-2] 10.0.10.6(53714) replicator@[unknown] STATEMENT:  START_REPLICATION SLOT "db_01" 0/B000000 TIMELINE 1
2023-12-10 22:30:52 MSK [605233-1] 10.0.10.6(53722) replicator@[unknown] ERROR:  replication slot "db_01" does not exist
2023-12-10 22:30:52 MSK [605233-2] 10.0.10.6(53722) replicator@[unknown] STATEMENT:  START_REPLICATION SLOT "db_01" 0/B000000 TIMELINE 2
2023-12-10 22:30:52 MSK [605234-1] 10.0.10.6(53724) replicator@[unknown] ERROR:  replication slot "db_01" does not exist
2023-12-10 22:30:52 MSK [605234-2] 10.0.10.6(53724) replicator@[unknown] STATEMENT:  START_REPLICATION SLOT "db_01" 0/B000000 TIMELINE 2

![image](https://github.com/sn1za/MTS-SRE-courses/assets/50699608/8061067d-fe3e-4740-8001-593769e0ccca)


4. Анализ результатов
Переключение при отключении мастера происходит очень быстро и с большой надеждой не должно заафектить юзеров, при восстановлении мастера есть ошибка, так как слот репликации с именем "db_01" не существует. Затем PostgreSQL пытается начать репликацию с использованием этого слота, что приводит к ошибке. данные не потерялись, время переключения очень быстрое.



## Эксперимент 2: Имитация частичной потери сети
1. Описание эксперимента
Инструменты: Используем Blade для создания сетевой изоляции с потерей пакетов между узлами.
``blade create network corrupt --percent 10 --destination-ip 10.0.10.3 --interface ens160 --timeout 300``
2. Ожидаемые результаты
Способность системы справиться: Ожидаем, что система etcd сохранит доступность и сможет восстановить репликацию после восстановления сети.
Ожидаемое время восстановления: Планируем, что восстановление должно занять не более 5 минут.
3. Реальные результаты


4. Анализ результатов
