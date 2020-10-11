#!/bin/bash
for i in {1..100}
do
   curl -X POST localhost:8081/register \
    -H "content-type:application/json" \
    -d '{"email":"mantapjiwa$i@gmail.com", "password":"kunyuk"}'
done