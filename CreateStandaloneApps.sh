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

cp -r "./examples/BlankProjectJS" "${appsDir}"
mkdir "${appsDir}/BlankProjectJS/libs"
cp -r "./libs/GateCore" "${appsDir}/BlankProjectJS/libs"
cp -r "./libs/GateDiscovery" "${appsDir}/BlankProjectJS/libs"
cp -r "./libs/GateDevice" "${appsDir}/BlankProjectJS/libs"
cp -r "./libs/GateController" "${appsDir}/BlankProjectJS/libs"
cp -r "./libs/GateViewModel" "${appsDir}/BlankProjectJS/libs"

cp -r "./examples/BlankProjectTS" "${appsDir}"
mkdir "${appsDir}/BlankProjectTS/libs"
cp -r "./libs/GateCore" "${appsDir}/BlankProjectTS/libs"
cp -r "./libs/GateDiscovery" "${appsDir}/BlankProjectTS/libs"
cp -r "./libs/GateDevice" "${appsDir}/BlankProjectTS/libs"
cp -r "./libs/GateController" "${appsDir}/BlankProjectTS/libs"
cp -r "./libs/GateViewModel" "${appsDir}/BlankProjectTS/libs"

echo -e "\nInstalling LocalServer"
cd "${appsDir}/LocalServer" || echo "Error accessing path" exit
npm link ./libs/GateCore

echo -e "\n\nInstalling GateHub"
cd "../GateHub"  || echo "Error accessing path" exit
npm link ./libs/GateCore ./libs/GateDiscovery

echo -e "\n\nInstalling BlankProjectJS"
cd "../BlankProjectJS"  || echo "Error accessing path" exit
npm link ./libs/GateCore ./libs/GateDiscovery ./libs/GateDevice ./libs/GateController ./libs/GateViewModel

echo -e "\n\nInstalling BlankProjectTS"
cd "../BlankProjectTS"  || echo "Error accessing path" exit
npm link ./libs/GateCore ./libs/GateDiscovery ./libs/GateDevice ./libs/GateController ./libs/GateViewModel