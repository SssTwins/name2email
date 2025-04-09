#!/bin/bash

# 清理旧文件
echo "Cleaning old files..."
rm -rf name2email
rm -f name2email.zip

# 复制build文件夹
echo "Copying build folder..."
cp -r build name2email

# 打包文件
echo "Creating zip archive..."
zip -r name2email.zip name2email name2email.xlsx

echo "Operation completed!"
