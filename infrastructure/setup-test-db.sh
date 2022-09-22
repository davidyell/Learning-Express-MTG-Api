#! /bin/bash
set +x

envFile=.env.test
if [ ! -f "$envFile" ]; then
    echo "$envFile does not exist, please copy the `.env.example` file to `.env.test` and update the database path"
fi

export $(grep -v '^#' $envFile | xargs)

dbPath=$(echo $DATABASE_URL | sed -E 's/file://')

yarn dotenv -e $envFile -- yarn prisma db push
sqlite3 -init ./infrastructure/sql/import-all.txt $dbPath
yarn dotenv -e $envFile -- yarn prisma db seed