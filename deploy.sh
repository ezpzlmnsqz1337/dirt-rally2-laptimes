export TARGET=malina

npm run build

ssh pi@malina 'cd /home/pi/workspace/dirt-rally2/ && find . -mindepth 1 -not -path "./images/*" -not -path "./images" -exec rm -rf {} +'
rm -rf ./dist/images
scp -r ./dist/** pi@malina:/home/pi/workspace/dirt-rally2/
