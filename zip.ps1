#!/usr/bin/env pwsh

# 清理旧文件
Write-Host "Cleaning old files..."
Remove-Item -Path "name2email" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "name2email.zip" -Force -ErrorAction SilentlyContinue

# 复制build文件夹
Write-Host "Copying build folder..."
Copy-Item -Path "build" -Destination "name2email" -Recurse

# 打包文件
Write-Host "Creating zip archive..."
Compress-Archive -Path "name2email", "name2email.xlsx" -DestinationPath "name2email.zip" -Force

Write-Host "Operation completed!"
