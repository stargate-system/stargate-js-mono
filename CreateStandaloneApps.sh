#!/bin/bash

while getopts 'b' OPTION; do
  case "$OPTION" in
    b)
      echo "Building project..."
      npm run build
      ;;
    ?)
      echo "Unknown option"
      ;;
  esac
done

appsDir="../StargateApps"

echo "Removing previous version..."

rm -rf "${appsDir}"
mkdir "${appsDir}"

echo "Copying files..."

mkdir "${appsDir}/LocalServer"
mkdir "${appsDir}/LocalServer/libs"
cp -r "./apps/LocalServer/dist" "${appsDir}/LocalServer"
cp "./apps/LocalServer/package.json" "${appsDir}/LocalServer"
cp -r "./apps/LocalServer/out" "${appsDir}/LocalServer"
cp -r "./libs/GateCore" "${appsDir}/LocalServer/libs"

mkdir "${appsDir}/GateHub"
mkdir "${appsDir}/GateHub/libs"
cp -r "./apps/GateHub/dist" "${appsDir}/GateHub"
cp "./apps/GateHub/package.json" "${appsDir}/GateHub"
cp -r "./libs/GateCore" "${appsDir}/GateHub/libs"
cp -r "./libs/GateDiscovery" "${appsDir}/GateHub/libs"

cp -r "./examples/BlankProject" "${appsDir}"
mkdir "${appsDir}/BlankProject/libs"
cp -r "./libs/GateCore" "${appsDir}/BlankProject/libs"
cp -r "./libs/GateDiscovery" "${appsDir}/BlankProject/libs"
cp -r "./libs/GateDevice" "${appsDir}/BlankProject/libs"
cp -r "./libs/GateController" "${appsDir}/BlankProject/libs"
cp -r "./libs/GateViewModel" "${appsDir}/BlankProject/libs"

echo -e "\nInstalling LocalServer"
cd "${appsDir}/LocalServer" || echo "Error accessing path" exit
npm link ./libs/GateCore

echo -e "\n\nInstalling GateHub"
cd "../GateHub"  || echo "Error accessing path" exit
npm link ./libs/GateCore ./libs/GateDiscovery

echo -e "\n\nInstalling BlankProject"
cd "../BlankProject"  || echo "Error accessing path" exit
npm link ./libs/GateCore ./libs/GateDiscovery ./libs/GateDevice ./libs/GateController ./libs/GateViewModel
