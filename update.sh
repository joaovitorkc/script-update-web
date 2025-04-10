git pull
if [ $? -ne 0 ]; then
  echo 'Failed to pull from git!'
  exit 1
fi

npm install
if [ $? -ne 0 ]; then
  echo 'Failed to install npm packages!'
  exit 1
fi

rm -rf temp

BUILD_DIR="temp" npm run build
if [ $? -ne 0 ]; then
  echo 'Build failed!'
  exit 1
fi

if [ ! -d "temp" ]; then
  echo 'temp directory does not exist!'
  exit 1
fi

rm -rf .next
mv temp .next
pm2 reload 1
if [ $? -ne 0 ]; then
  echo 'Failed to reload pm2!'
  exit 1
fi
