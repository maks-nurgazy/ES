sudo apt install openjdk-8-jre-headless
sudo apt-get update
sudo apt-get install logstash
sudo /usr/share/logstash/bin/logstash -f /etc/logstash/conf.d/csv-read.conf
