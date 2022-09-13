#! /bin/bash
set +x

FILE=.env
if [ ! -f "$FILE" ]; then
    echo "$FILE does not exist, please copy the `.env.example` file"
fi

yarn prisma db push
sqlite3 -init ./infrastructure/sql/cards.sql ./infrastructure/database.sqlite
yarn prisma db seed