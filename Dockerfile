FROM ubuntu:20.04
RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone
RUN apt-get update -y
RUN apt-get install -y python3 python3-pip python3-opencv libcurl4-openssl-dev libssl-dev libpcsclite-dev psmisc
RUN mkdir -p /home/faceonlive_id_recognition
WORKDIR /home/faceonlive_id_recognition
COPY ./requirements.txt .
COPY ./ocrengine ./ocrengine
COPY ./ocrengine/libimutils.so /usr/lib
COPY ./ocrengine/libttvcore.so /usr/lib
COPY ./app.py .
COPY ./demo.py .
COPY ./run.sh .
RUN pip3 install -r requirements.txt
RUN chmod a+x ./ocrengine/ttvocrsrv run.sh
CMD ["./run.sh"]
EXPOSE 8080