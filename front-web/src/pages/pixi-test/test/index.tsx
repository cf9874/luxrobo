/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextPage } from "next"
import { ChangeEvent, useEffect } from "react"

import { Graphics as _Graphics } from "pixi.js"
import { useState } from "react"
import LogicDiag from "components/Diagram/LogicDiagram"
import PowerDiag from "components/Diagram/PowerDiagram"
import { DiagTestUtil } from "components/Diagram/Utils/Test"
import { Button } from "antd"
import LayoutDiag from "components/Diagram/LayoutDiagram"
import TestDiag from "components/Diagram/TestDiagram"
import ImageDiag from "components/Diagram/ImageDiagram"
import { useDiagMenu } from "components/Diagram/useDiagMenu"

import { Helper } from "dxf"
import PolylineEntityData from "dxf/handlers/entity/polyline"
import { DiagGeoUtil } from "components/Diagram/Utils/Geo"
import { DiagBlockConst } from "components/Diagram/Models/Block"

const PixiTest: NextPage = () => {
  const [json, setJson] = useState(DiagTestUtil.layoutJson())

  // const [image, setImage] = useState(undefined as Blob | undefined);
  // const [invert, setInvert] = useState(false);
  // const [anchor, setAnchor] = useState(0);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      // setImage(e.target.files[0]);

      const fr = new FileReader()
      fr.onload = ev => {
        if (ev.target) {
          const data = ev.target.result as string
          console.log(data)
          const helper = new Helper(data)

          // The 1-to-1 object representation of the DXF
          console.log("parsed:", helper.parsed)

          // Denormalised blocks inserted with transforms applied
          console.log("denormalised:", helper.denormalised)

          // Create polylines (e.g. to render in WebGL)
          console.log("polylines:", helper.toPolylines())

          // Create an SVG
          console.log("svg:", helper.toSVG())

          console.log((helper.parsed?.entities[0] as PolylineEntityData).vertices)
        }
      }

      fr.readAsText(e.target.files[0])
    }
  }

  // const onInvert = (e: ChangeEvent<HTMLInputElement>) => {

  //   if (e.target) {
  //     setInvert(e.target.checked);
  //   }
  // };

  // const onAnchor = (e: ChangeEvent<HTMLInputElement>) => {

  //   if (e.target) {
  //     setAnchor(e.target.checked ? 1 : 0);
  //   }
  // };

  // const logicJson = `{"blocks":[{"block_id":"VcfoR48SGMJbmv2XBF2Cna","color":"","description":"Multiprotocol Modules SMD module, ESP32-C3FN4, PCB antenna, -40 C +85 C","icon":"/icons/mcu.svg","part_id":"AsSfGMRUavGfvexbzYEtaz","specification":null,"type":"MCU","category":"MCU","footprint_image":"","option_names":{"AntennaBuiltIn":"Yes","Bluetooth":"Yes","DebugMCU":"UART","GPIOHeader":"No","ResetSwitch":"No","SDCard":"No","WiFi":"Yes"},"part_image":"https://www.mouser.com/images/espressifsystems/images/ESP32-C3-MINI-1_SPL.jpg","part_name":"ESP32-C3-MINI-1-N4","symbol_image":""},{"block_id":"mJG6AEPFHnbQGud66nbVbY","color":"","description":"Tactile Switches SWITCH TACTILE","icon":"/icons/switch.svg","part_id":"Tb5oe7r6EwjT8RdRzQ2PTu","specification":null,"type":"Switch","category":"Input","footprint_image":"","option_names":{"MountingStyle":"Through Hole","NumOfPosition":"1","Orientation":"Right Angle","RatingVoltage":"1.8V","SwitchType":"Tactile"},"part_image":"https://www.mouser.com/images/tycoelectronics/images/1-1825027-1_SPL.jpg","part_name":"1-1825027-7","symbol_image":""},{"block_id":"B8NRxPswGwd9E9KsHMDm2V","color":"","description":"Tactile Switches SWITCH TACTILE","icon":"/icons/switch.svg","part_id":"Tb5oe7r6EwjT8RdRzQ2PTu","specification":null,"type":"Switch","category":"Input","footprint_image":"","option_names":{"MountingStyle":"Through Hole","NumOfPosition":"1","Orientation":"Right Angle","RatingVoltage":"1.8V","SwitchType":"Tactile"},"part_image":"https://www.mouser.com/images/tycoelectronics/images/1-1825027-1_SPL.jpg","part_name":"1-1825027-7","symbol_image":""},{"block_id":"KFT6XotVjaybSwdaFF6EwX","color":"","description":"GNSS / GPS Modules Extremely Compact Multi-Constellation GNSS Module with Ultra-Low Power Consumption","icon":"/icons/gps.svg","part_id":"YVjTBxjT66967iTtvThZ92","specification":null,"type":"GPS","category":"Input","footprint_image":"","option_names":{"Interface":"I2C","MountingStyle":"SMD","RatingVoltage":"3.3V"},"part_image":"https://www.mouser.com/images/quectel/images/LG77LIAEK_SPL.jpg","part_name":"LG77LICMD","symbol_image":""},{"block_id":"9n82nZvZDLzBdteQJ5pd8Z","color":"","description":"IMUs - Inertial Measurement Units Compact, low-power Inertial Measurement Unit ideal for wearables, hearables, and mobile devices","icon":"/icons/inertial.svg","part_id":"7xEVkBSPSHxFhsjDjQTxyU","specification":null,"type":"Inertial","category":"Input","footprint_image":"","option_names":{"Axis":"6-axis","Interface":"I2C","MountingStyle":"SMD","RatingVoltage":"3.3V","Resolution":"16bit"},"part_image":"https://www.mouser.com/images/boschsensortec/images/BMI323_SPL.jpg","part_name":"BMI323","symbol_image":""},{"block_id":"d4xBKkhTYz6cepqvk43HCE","color":"","description":"Standard LEDs - SMD RGB LED","icon":"/icons/led.svg","part_id":"S9q5V4r9jvitNRkXk4evp9","specification":null,"type":"LED","category":"Output","footprint_image":"","option_names":{"Color":"RGB","LEDPower":"Standard LED","MountingStyle":"SMD","RatingVoltage":"5V","Size":"Rect - Big","UseDriver":"No"},"part_image":"https://www.mouser.com/images/inolux/images/PLCC4_DSL.jpg","part_name":"IN-P32TATRGB","symbol_image":""},{"block_id":"e9wXb8ujKKeMaqFBWT7vU4","color":"","description":"Supercapacitors / Ultracapacitors 3V 3.3F 8X20mm Radial Low ESR","icon":"/icons/spc.svg","part_id":"WdyeHbwwt3XFgkfMnomdbS","specification":null,"type":"SPC","category":"Battery","footprint_image":"","option_names":{"Capacitance":"3.3F","TargetVoltage":"5V"},"part_image":"https://www.mouser.com/images/avx/images/SCC_Series_DSL.jpg","part_name":"SCCR20E335PRB","symbol_image":""},{"block_id":"9uRxqMYsfHQ8cGRWCZwRyP","color":"","description":"USB Connectors USB Type C,2.0, Rec,SMT, 0.95mmTH Shell Stakes,G/F,RA,Top Mnt,T&R","icon":"/icons/usb.svg","part_id":"n6qBfEVuTtTeQjouLwnC4c","specification":null,"type":"USBOut","category":"PowerOut","footprint_image":"","option_names":{"Current":"0.5","Gender":"Female","MountingStyle":"SMD","Orientation":"Right Angle","Type":"Type-C","Voltage":"5"},"part_image":"https://www.mouser.com/images/globalconnectortechnology/images/USB4105_15A_Logo_SPL.jpg","part_name":"USB4105-GF-A","symbol_image":""},{"block_id":"JjdVWzMEk4z4HiubKhMaoX","color":"","description":"CigarJack Connectors","icon":"/icons/cigarjack.svg","part_id":"LQiRxskRGRBEStaoQkvTko","specification":null,"type":"CigarJackIn","category":"PowerIn","footprint_image":"","option_names":{"Current":"5","Gender":"Male","Voltage":"12"},"part_image":"","part_name":"CigarJack","symbol_image":""},{"block_id":"XYnWW9SwMkPGmAQknsKkq6","color":"","description":"LDO Voltage Regulators LDO BJT HiCurr SOT223 T&R 4K","icon":"/icons/ldo.svg","part_id":"LKPD9sGqToptGmvCFCkGP4","specification":{"heating_value":"68"},"type":"LDO","category":"Subpart","footprint_image":"","option_names":{"InputVoltage":"5","MountingStyle":"SMD","OutputCurrent":"0.3","OutputVoltage":"3.3"},"part_image":"https://www.mouser.com/images/mouserelectronics/images/SOT_223_3_t.jpg","part_name":"AZ1117CH2-3.3TRG1","symbol_image":""},{"block_id":"7vf4FCddMPSzZu88AzruhU","color":"","description":"LDO Voltage Regulators LDO BJT HiCurr SOT223 T&R 4K","icon":"/icons/ldo.svg","part_id":"LKPD9sGqToptGmvCFCkGP4","specification":{"heating_value":"68"},"type":"LDO","category":"Subpart","footprint_image":"","option_names":{"InputVoltage":"5","MountingStyle":"SMD","OutputCurrent":"0.3","OutputVoltage":"1.8"},"part_image":"https://www.mouser.com/images/mouserelectronics/images/SOT_223_3_t.jpg","part_name":"AZ1117CH2-3.3TRG1","symbol_image":""},{"block_id":"CvujnbkWc5mzzpfvMePFeD","color":"","description":"Switching Voltage Regulators 150 KHZ 3A STEP-DOWN VLTG REG","icon":"/icons/buck.svg","part_id":"iknYmE9qcRbQq7eQ3c5Tfo","specification":null,"type":"Buck","category":"Subpart","footprint_image":"","option_names":{"InputVoltage":"12","MountingStyle":"SMD","OutputCurrent":"1","OutputVoltage":"5"},"part_image":"https://www.mouser.com/images/texasinstruments/images/ITP_TI_TO-263-5_KTT_t.jpg","part_name":"LM2596SX-5.0","symbol_image":""}],"links":[{"block_id":"VcfoR48SGMJbmv2XBF2Cna","target_blocks":[],"type":"MCU"},{"block_id":"mJG6AEPFHnbQGud66nbVbY","target_blocks":[{"link_status":true,"target_block_id":"VcfoR48SGMJbmv2XBF2Cna"}],"type":"Switch"},{"block_id":"B8NRxPswGwd9E9KsHMDm2V","target_blocks":[{"link_status":true,"target_block_id":"VcfoR48SGMJbmv2XBF2Cna"}],"type":"Switch"},{"block_id":"KFT6XotVjaybSwdaFF6EwX","target_blocks":[{"link_status":true,"target_block_id":"VcfoR48SGMJbmv2XBF2Cna"}],"type":"GPS"},{"block_id":"9n82nZvZDLzBdteQJ5pd8Z","target_blocks":[{"link_status":true,"target_block_id":"VcfoR48SGMJbmv2XBF2Cna"}],"type":"Inertial"},{"block_id":"d4xBKkhTYz6cepqvk43HCE","target_blocks":[{"link_status":true,"target_block_id":"VcfoR48SGMJbmv2XBF2Cna"}],"type":"LED"},{"block_id":"e9wXb8ujKKeMaqFBWT7vU4","target_blocks":[{"link_status":true,"target_block_id":"Power"}],"type":"SPC"},{"block_id":"9uRxqMYsfHQ8cGRWCZwRyP","target_blocks":[{"link_status":true,"target_block_id":"Power"}],"type":"USBOut"},{"block_id":"JjdVWzMEk4z4HiubKhMaoX","target_blocks":[{"link_status":true,"target_block_id":"Power"}],"type":"CigarJackIn"}]}`;
  // const powerJson = `{"blocks":[{"block_id":"nb8Xojo5r8AtfgxyimFmPx","color":"","description":"Multiprotocol Modules SMD module, ESP32-C3FN4, PCB antenna, -40 C +85 C","icon":"/icons/mcu.svg","part_id":"AsSfGMRUavGfvexbzYEtaz","specification":null,"type":"MCU","category":"MCU","footprint_image":"","option_names":{"AntennaBuiltIn":"Yes","Bluetooth":"Yes","DebugMCU":"UART","GPIOHeader":"No","ResetSwitch":"No","SDCard":"No","WiFi":"Yes"},"part_image":"https://www.mouser.com/images/espressifsystems/images/ESP32-C3-MINI-1_SPL.jpg","part_name":"ESP32-C3-MINI-1-N4","symbol_image":""},{"block_id":"AhtSp2QkSZHMJJBFCfS6xh","color":"","description":"Tactile Switches SWITCH TACTILE","icon":"/icons/switch.svg","part_id":"Tb5oe7r6EwjT8RdRzQ2PTu","specification":null,"type":"Switch","category":"Input","footprint_image":"","option_names":{"MountingStyle":"Through Hole","NumOfPosition":"1","Orientation":"Right Angle","RatingVoltage":"1.8V","SwitchType":"Tactile"},"part_image":"https://www.mouser.com/images/tycoelectronics/images/1-1825027-1_SPL.jpg","part_name":"1-1825027-7","symbol_image":""},{"block_id":"B9w7t5HCq5AKVCySc9WRLJ","color":"","description":"GNSS / GPS Modules Extremely Compact Multi-Constellation GNSS Module with Ultra-Low Power Consumption","icon":"/icons/gps.svg","part_id":"YVjTBxjT66967iTtvThZ92","specification":null,"type":"GPS","category":"Input","footprint_image":"","option_names":{"Interface":"I2C","MountingStyle":"SMD","RatingVoltage":"3.3V"},"part_image":"https://www.mouser.com/images/quectel/images/LG77LIAEK_SPL.jpg","part_name":"LG77LICMD","symbol_image":""},{"block_id":"C8CJ9qf7w4h9VEReuP8NKR","color":"","description":"IMUs - Inertial Measurement Units Compact, low-power Inertial Measurement Unit ideal for wearables, hearables, and mobile devices","icon":"/icons/inertial.svg","part_id":"7xEVkBSPSHxFhsjDjQTxyU","specification":null,"type":"Inertial","category":"Input","footprint_image":"","option_names":{"Axis":"6-axis","Interface":"I2C","MountingStyle":"SMD","RatingVoltage":"3.3V","Resolution":"16bit"},"part_image":"https://www.mouser.com/images/boschsensortec/images/BMI323_SPL.jpg","part_name":"BMI323","symbol_image":""},{"block_id":"iSx3mRzZoTk2Bs69u93aJ9","color":"","description":"Standard LEDs - SMD RGB LED","icon":"/icons/led.svg","part_id":"S9q5V4r9jvitNRkXk4evp9","specification":null,"type":"LED","category":"Output","footprint_image":"","option_names":{"Color":"RGB","LEDPower":"Standard LED","MountingStyle":"SMD","RatingVoltage":"5V","Size":"Rect - Big","UseDriver":"No"},"part_image":"https://www.mouser.com/images/inolux/images/PLCC4_DSL.jpg","part_name":"IN-P32TATRGB","symbol_image":""},{"block_id":"CkN4X5qH4A26FqQbUutRqa","color":"","description":"Supercapacitors / Ultracapacitors 3V 3.3F 8X20mm Radial Low ESR","icon":"/icons/spc.svg","part_id":"WdyeHbwwt3XFgkfMnomdbS","specification":null,"type":"SPC","category":"Battery","footprint_image":"","option_names":{"Capacitance":"3.3F","TargetVoltage":"5V"},"part_image":"https://www.mouser.com/images/avx/images/SCC_Series_DSL.jpg","part_name":"SCCR20E335PRB","symbol_image":""}],"powernets":[{"group":[],"net_name":"SUB_MCU0","outputs":[],"ref_voltage":3.3},{"group":["nb8Xojo5r8AtfgxyimFmPx","B9w7t5HCq5AKVCySc9WRLJ","C8CJ9qf7w4h9VEReuP8NKR"],"net_name":"3.3V","outputs":[],"ref_voltage":3.3},{"group":["AhtSp2QkSZHMJJBFCfS6xh"],"net_name":"1.8V","outputs":[],"ref_voltage":1.8},{"group":["iSx3mRzZoTk2Bs69u93aJ9","CkN4X5qH4A26FqQbUutRqa","g2hHmSHZQpG4hEJYxZFoeP"],"net_name":"5V","outputs":[{"regulator_id":"PUFvhmZHHgp7UPxoZ87ctV","target_net_name":"1.8V","type":"LDO"}],"ref_voltage":5},{"group":["WFiWSvKRBeqcbkBgfrakPK"],"net_name":"VIN_12V","outputs":[{"regulator_id":"fnhjrRHvGBExeycN2s2EEH","target_net_name":"5V","type":"Buck"}],"ref_voltage":12}]}`;
  // const powerJson = `{"blocks":[{"block_id":"VcfoR48SGMJbmv2XBF2Cna","color":"","description":"WiFi Modules - 802.11 SMD Module, ESP32-S3FN8, 8 MB SPI Flash, PCB Antenna","icon":"/icons/mcu.svg","part_id":"BwUEsweDDEwTcfgVxZT85R","specification":{"PinNum":"37 pins"},"type":"MCU","category":"MCU","footprint_image":"","option_names":{"AntennaBuiltIn":"Yes","Bluetooth":"Yes","DebugMCU":"UART","GPIOHeader":"No","ResetSwitch":"No","SDCard":"No","WiFi":"Yes"},"part_image":"https://www.mouser.kr/images/espressifsystems/images/ESP32-S3-MINI-1U-N8_SPL.jpg","part_name":"ESP32-S3-MINI-1-N8","symbol_image":""},{"block_id":"mJG6AEPFHnbQGud66nbVbY","color":"","description":"Tactile Switches SWITCH TACTILE","icon":"/icons/switch.svg","part_id":"Tb5oe7r6EwjT8RdRzQ2PTu","specification":null,"type":"Switch","category":"Input","footprint_image":"","option_names":{"MountingStyle":"Through Hole","NumOfPosition":"1","Orientation":"Right Angle","RatingVoltage":"1.8V","SwitchType":"Tactile"},"part_image":"https://www.mouser.com/images/tycoelectronics/images/1-1825027-1_SPL.jpg","part_name":"1-1825027-7","symbol_image":""},{"block_id":"B8NRxPswGwd9E9KsHMDm2V","color":"","description":"Tactile Switches SWITCH TACTILE","icon":"/icons/switch.svg","part_id":"Tb5oe7r6EwjT8RdRzQ2PTu","specification":null,"type":"Switch","category":"Input","footprint_image":"","option_names":{"MountingStyle":"Through Hole","NumOfPosition":"1","Orientation":"Right Angle","RatingVoltage":"1.8V","SwitchType":"Tactile"},"part_image":"https://www.mouser.com/images/tycoelectronics/images/1-1825027-1_SPL.jpg","part_name":"1-1825027-7","symbol_image":""},{"block_id":"KFT6XotVjaybSwdaFF6EwX","color":"","description":"GNSS / GPS Modules Navigation BeiDou, Galileo, GLONASS, GPS, GNSS Transceiver Module 1.561GHz, 1.575GHz, 1.602GHz Antenna Not Included","icon":"/icons/gps.svg","part_id":"kSBFY8oUYe3q5cZwws9Z7a","specification":null,"type":"GPS","category":"Input","footprint_image":"","option_names":{"Interface":"I2C","MountingStyle":"SMD","RatingVoltage":"3.3V"},"part_image":"https://www.mouser.com/images/quectel/images/L76L-M33_SPL.jpg","part_name":"L76L-M33","symbol_image":""},{"block_id":"9n82nZvZDLzBdteQJ5pd8Z","color":"","description":"IMUs - Inertial Measurement Units Compact, low-power Inertial Measurement Unit ideal for wearables, hearables, and mobile devices","icon":"/icons/inertial.svg","part_id":"7xEVkBSPSHxFhsjDjQTxyU","specification":null,"type":"Inertial","category":"Input","footprint_image":"","option_names":{"Axis":"6-axis","Interface":"I2C","MountingStyle":"SMD","RatingVoltage":"3.3V","Resolution":"16bit"},"part_image":"https://www.mouser.com/images/boschsensortec/images/BMI323_SPL.jpg","part_name":"BMI323","symbol_image":""},{"block_id":"d4xBKkhTYz6cepqvk43HCE","color":"","description":"Standard LEDs - SMD RGB LED","icon":"/icons/led.svg","part_id":"S9q5V4r9jvitNRkXk4evp9","specification":null,"type":"LED","category":"Output","footprint_image":"","option_names":{"Color":"RGB","LEDPower":"Standard LED","MountingStyle":"SMD","RatingVoltage":"5V","Size":"Rect - Big","UseDriver":"No"},"part_image":"https://www.mouser.com/images/inolux/images/PLCC4_DSL.jpg","part_name":"IN-P32TATRGB","symbol_image":""},{"block_id":"e9wXb8ujKKeMaqFBWT7vU4","color":"","description":"Supercapacitors / Ultracapacitors 3V 3.3F 8X20mm Radial Low ESR","icon":"/icons/spc.svg","part_id":"WdyeHbwwt3XFgkfMnomdbS","specification":null,"type":"SPC","category":"Battery","footprint_image":"","option_names":{"Capacitance":"3.3F","TargetVoltage":"5V"},"part_image":"https://www.mouser.com/images/avx/images/SCC_Series_DSL.jpg","part_name":"SCCR20E335PRB","symbol_image":""}],"powernets":[{"group":[],"net_name":"SUB_MCU0","outputs":[],"ref_voltage":3.3},{"group":["VcfoR48SGMJbmv2XBF2Cna","KFT6XotVjaybSwdaFF6EwX","9n82nZvZDLzBdteQJ5pd8Z"],"net_name":"3.3V","outputs":[],"ref_voltage":3.3},{"group":["mJG6AEPFHnbQGud66nbVbY","B8NRxPswGwd9E9KsHMDm2V"],"net_name":"1.8V","outputs":[],"ref_voltage":1.8},{"group":["d4xBKkhTYz6cepqvk43HCE","e9wXb8ujKKeMaqFBWT7vU4"],"net_name":"5V","outputs":[{"regulator_id":"7vf4FCddMPSzZu88AzruhU","target_net_name":"1.8V","type":"LDO"}],"ref_voltage":5},{"group":["9uRxqMYsfHQ8cGRWCZwRyP"],"net_name":"VIN_5V","outputs":[],"ref_voltage":5},{"group":["JjdVWzMEk4z4HiubKhMaoX"],"net_name":"VIN_12V","outputs":[{"regulator_id":"CvujnbkWc5mzzpfvMePFeD","target_net_name":"5V","type":"Buck"}],"ref_voltage":12}]}`;
  // const layoutJson = `{"blocks":[{"block_id":"be6Exz6HQdz5NfESX8hZtc","color":"","description":"Multiprotocol Modules SMD module, ESP32-C3FN4, PCB antenna, -40 C +85 C","icon":"/icons/mcu.svg","part_id":"AsSfGMRUavGfvexbzYEtaz","specification":null,"type":"MCU","category":"MCU","footprint_image":"","option_names":{"AntennaBuiltIn":"Yes","Bluetooth":"Yes","DebugMCU":"UART","GPIOHeader":"No","ResetSwitch":"No","SDCard":"No","WiFi":"Yes"},"part_image":"https://www.mouser.com/images/espressifsystems/images/ESP32-C3-MINI-1_SPL.jpg","part_name":"ESP32-C3-MINI-1-N4","symbol_image":""},{"block_id":"DmBmACRbjv3qqWkp37z6K2","color":"","description":"Tactile Switches SWITCH TACTILE","icon":"/icons/switch.svg","part_id":"Tb5oe7r6EwjT8RdRzQ2PTu","specification":null,"type":"Switch","category":"Input","footprint_image":"","option_names":{"MountingStyle":"Through Hole","NumOfPosition":"1","Orientation":"Right Angle","RatingVoltage":"1.8V","SwitchType":"Tactile"},"part_image":"https://www.mouser.com/images/tycoelectronics/images/1-1825027-1_SPL.jpg","part_name":"1-1825027-7","symbol_image":""},{"block_id":"3coUykJRiWah9bNqbTqLcP","color":"","description":"GNSS / GPS Modules Extremely Compact Multi-Constellation GNSS Module with Ultra-Low Power Consumption","icon":"/icons/gps.svg","part_id":"YVjTBxjT66967iTtvThZ92","specification":null,"type":"GPS","category":"Input","footprint_image":"","option_names":{"Interface":"I2C","MountingStyle":"SMD","RatingVoltage":"3.3V"},"part_image":"https://www.mouser.com/images/quectel/images/LG77LIAEK_SPL.jpg","part_name":"LG77LICMD","symbol_image":""},{"block_id":"jfzbjyYS4HyJckmfLqrmgr","color":"","description":"IMUs - Inertial Measurement Units Compact, low-power Inertial Measurement Unit ideal for wearables, hearables, and mobile devices","icon":"/icons/inertial.svg","part_id":"7xEVkBSPSHxFhsjDjQTxyU","specification":null,"type":"Inertial","category":"Input","footprint_image":"","option_names":{"Axis":"6-axis","Interface":"I2C","MountingStyle":"SMD","RatingVoltage":"3.3V","Resolution":"16bit"},"part_image":"https://www.mouser.com/images/boschsensortec/images/BMI323_SPL.jpg","part_name":"BMI323","symbol_image":""},{"block_id":"CYZ4LixNFtHyxpojbTEDRf","color":"","description":"Standard LEDs - SMD RGB LED","icon":"/icons/led.svg","part_id":"S9q5V4r9jvitNRkXk4evp9","specification":null,"type":"LED","category":"Output","footprint_image":"","option_names":{"Color":"RGB","LEDPower":"Standard LED","MountingStyle":"SMD","RatingVoltage":"5V","Size":"Rect - Big","UseDriver":"No"},"part_image":"https://www.mouser.com/images/inolux/images/PLCC4_DSL.jpg","part_name":"IN-P32TATRGB","symbol_image":""},{"block_id":"fdjYpZy2J7AGwwsKFhDgT8","color":"","description":"Supercapacitors / Ultracapacitors 3V 3.3F 8X20mm Radial Low ESR","icon":"/icons/spc.svg","part_id":"WdyeHbwwt3XFgkfMnomdbS","specification":null,"type":"SPC","category":"Battery","footprint_image":"","option_names":{"Capacitance":"3.3F","TargetVoltage":"5V"},"part_image":"https://www.mouser.com/images/avx/images/SCC_Series_DSL.jpg","part_name":"SCCR20E335PRB","symbol_image":""},{"block_id":"dDrQL8whiSP9GtENwQ99uV","color":"","description":"USB Connectors USB Type C,2.0, Rec,SMT, 0.95mmTH Shell Stakes,G/F,RA,Top Mnt,T&R","icon":"/icons/usb.svg","part_id":"n6qBfEVuTtTeQjouLwnC4c","specification":null,"type":"USBOut","category":"PowerOut","footprint_image":"","option_names":{"Current":"0.5","Gender":"Female","MountingStyle":"SMD","Orientation":"Right Angle","Type":"Type-C","Voltage":"5"},"part_image":"https://www.mouser.com/images/globalconnectortechnology/images/USB4105_15A_Logo_SPL.jpg","part_name":"USB4105-GF-A","symbol_image":""},{"block_id":"MPAqgFMYAY7W63a5KNCmpX","color":"","description":"CigarJack Connectors","icon":"/icons/cigarjack.svg","part_id":"LQiRxskRGRBEStaoQkvTko","specification":null,"type":"CigarJackIn","category":"PowerIn","footprint_image":"","option_names":{"Current":"5","Gender":"Male","Voltage":"12"},"part_image":"","part_name":"CigarJack","symbol_image":""},{"block_id":"Huqr5BGHV3CKqrAUMEunsn","color":"","description":"LDO Voltage Regulators LDO BJT HiCurr SOT223 T&R 4K","icon":"/icons/ldo.svg","part_id":"LKPD9sGqToptGmvCFCkGP4","specification":{"heating_value":"68"},"type":"LDO","category":"Subpart","footprint_image":"","option_names":{"InputVoltage":"5","MountingStyle":"SMD","OutputCurrent":"0.3","OutputVoltage":"1.8"},"part_image":"https://www.mouser.com/images/mouserelectronics/images/SOT_223_3_t.jpg","part_name":"AZ1117CH2-3.3TRG1","symbol_image":""}],"layout":{"hole_blocks":[],"image_blocks":[],"layout_blocks":[{"block_id":"be6Exz6HQdz5NfESX8hZtc","is_auto":false,"is_placed":false,"is_top":true,"out_shape_b":[{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0}],"out_shape_t":[{"x":0,"y":0,"r":0},{"x":50,"y":0,"r":0},{"x":50,"y":23,"r":0},{"x":0,"y":23,"r":0}],"pos":{"x":0,"y":0,"r":0}},{"block_id":"DmBmACRbjv3qqWkp37z6K2","is_auto":false,"is_placed":false,"is_top":true,"out_shape_b":[{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0}],"out_shape_t":[{"x":0,"y":0,"r":0},{"x":41,"y":0,"r":0},{"x":41,"y":25,"r":0},{"x":0,"y":25,"r":0}],"pos":{"x":0,"y":0,"r":0}},{"block_id":"3coUykJRiWah9bNqbTqLcP","is_auto":false,"is_placed":false,"is_top":true,"out_shape_b":[{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0}],"out_shape_t":[{"x":0,"y":0,"r":0},{"x":38,"y":0,"r":0},{"x":38,"y":56,"r":0},{"x":0,"y":56,"r":0}],"pos":{"x":0,"y":0,"r":0}},{"block_id":"jfzbjyYS4HyJckmfLqrmgr","is_auto":false,"is_placed":false,"is_top":true,"out_shape_b":[{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0}],"out_shape_t":[{"x":0,"y":0,"r":0},{"x":35,"y":0,"r":0},{"x":35,"y":72,"r":0},{"x":0,"y":72,"r":0}],"pos":{"x":0,"y":0,"r":0}},{"block_id":"CYZ4LixNFtHyxpojbTEDRf","is_auto":false,"is_placed":false,"is_top":true,"out_shape_b":[{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0}],"out_shape_t":[{"x":0,"y":0,"r":0},{"x":73,"y":0,"r":0},{"x":73,"y":53,"r":0},{"x":0,"y":53,"r":0}],"pos":{"x":0,"y":0,"r":0}},{"block_id":"fdjYpZy2J7AGwwsKFhDgT8","is_auto":false,"is_placed":false,"is_top":true,"out_shape_b":[{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0}],"out_shape_t":[{"x":0,"y":0,"r":0},{"x":21,"y":0,"r":0},{"x":21,"y":26,"r":0},{"x":0,"y":26,"r":0}],"pos":{"x":0,"y":0,"r":0}},{"block_id":"dDrQL8whiSP9GtENwQ99uV","is_auto":false,"is_placed":false,"is_top":true,"out_shape_b":[{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0},{"x":0,"y":0,"r":0}],"out_shape_t":[{"x":0,"y":0,"r":0},{"x":54,"y":0,"r":0},{"x":54,"y":25,"r":0},{"x":0,"y":25,"r":0}],"pos":{"x":0,"y":0,"r":0}}],"text_blocks":[],"shape":[{"x":0,"y":0,"r":0},{"x":250,"y":0,"r":0},{"x":250,"y":300,"r":0},{"x":0,"y":300,"r":0}]}}`;

  const logicJson = `
  {
    "blocks": [
        {
            "block_id": "fk79NZYdpr3pghCMR3nqnt",
            "color": "",
            "description": "GNSS / GPS Modules Extremely Compact Multi-Constellation GNSS Module with Ultra-Low Power Consumption",
            "icon": "/icons/gps.svg",
            "part_id": "YVjTBxjT66967iTtvThZ92",
            "specification": null,
            "type": "GPS",
            "category": "Input",
            "footprint_image": "",
            "option_names": {
                "Interface": "I2C",
                "RatingVoltage": "3.3V"
            },
            "part_image": "https://www.mouser.com/images/quectel/images/LG77LIAEK_SPL.jpg",
            "part_name": "LG77LICMD",
            "symbol_image": "",
            "index": 1
        },
        {
            "block_id": "Si3w7qTMwCHmZC2aKg68i6",
            "color": "",
            "description": "IMUs - Inertial Measurement Units Compact, low-power Inertial Measurement Unit ideal for wearables, hearables, and mobile devices",
            "icon": "/icons/inertial.svg",
            "part_id": "7xEVkBSPSHxFhsjDjQTxyU",
            "specification": null,
            "type": "Inertial",
            "category": "Input",
            "footprint_image": "",
            "option_names": {
                "Axis": "6-axis",
                "Interface": "I2C",
                "MountingStyle": "SMD",
                "RatingVoltage": "3.3V",
                "Resolution": "16bit"
            },
            "part_image": "https://www.mouser.com/images/boschsensortec/images/BMI323_SPL.jpg",
            "part_name": "BMI323",
            "symbol_image": "",
            "index": 1
        },
        {
            "block_id": "3qhK63P8FrZjgmVG6pCoNa",
            "color": "",
            "description": "LED Displays & Accessories Super Red Dot Matrix",
            "icon": "/icons/matrix.svg",
            "part_id": "kG9Lx9hmKqVpNm5Az4NH9n",
            "specification": null,
            "type": "Matrix",
            "category": "Output",
            "footprint_image": "",
            "option_names": {
                "Color": "Red",
                "ConnectType": "Common-Cathode",
                "Matrix Driver": "No",
                "RatingVoltage": "3.3V",
                "Size": "5x7"
            },
            "part_image": "https://www.mouser.com/images/liteon/images/LTP-757KR.jpg",
            "part_name": "LTP-757KR",
            "symbol_image": "",
            "index": 1
        },
        {
            "block_id": "g4tBnWuNe9YWPymWVmkjMm",
            "color": "",
            "description": "Supercapacitors / Ultracapacitors 3V 3.3F 8X20mm Radial Low ESR",
            "icon": "/icons/spc.svg",
            "part_id": "WdyeHbwwt3XFgkfMnomdbS",
            "specification": null,
            "type": "SPC",
            "category": "Battery",
            "footprint_image": "",
            "option_names": {
                "Capacitance": "3.3F",
                "TargetVoltage": "5V"
            },
            "part_image": "https://www.mouser.com/images/avx/images/SCC_Series_DSL.jpg",
            "part_name": "SCCR20E335PRB",
            "symbol_image": "",
            "index": 1
        },
        {
            "block_id": "mqMYM8ArJUoQTvWfMhPMfH",
            "color": "",
            "description": "USB Connectors USB Type C,2.0, Rec,SMT, 0.95mmTH Shell Stakes,G/F,RA,Top Mnt,T&R",
            "icon": "/icons/usb.svg",
            "part_id": "hrnoxSqviitzDNgJWoZ3BW",
            "specification": {
                "Gender": "Female",
                "Max Current": "5A",
                "Max Voltage": "48V",
                "Mounting Style": "SMD",
                "USB Type": "Type-C"
            },
            "type": "USBIn",
            "category": "PowerIn",
            "footprint_image": "https://dev-edaapi.luxrobo.com/footprint/Footprint_USB4105-GF-A.PNG",
            "option_names": {
                "Current": "2",
                "Gender": "Female",
                "MountingStyle": "SMD",
                "Orientation": "Right Angle",
                "Type": "Type-C",
                "Voltage": "5"
            },
            "part_image": "https://www.mouser.com/images/globalconnectortechnology/images/USB4105_15A_Logo_SPL.jpg",
            "part_name": "USB4105-GF-A",
            "symbol_image": "https://dev-edaapi.luxrobo.com/symbol/Symbol_USB4105-GF-A.png",
            "index": 1
        },
        {
            "block_id": "S7iqnUAV5pdKndZthoE82U",
            "color": "",
            "description": "WiFi Modules - 802.11 SMD Module, ESP32-S3FN8, 8 MB SPI Flash, PCB Antenna",
            "icon": "/icons/mcu.svg",
            "part_id": "BwUEsweDDEwTcfgVxZT85R",
            "specification": {
                "Mounting Style": "SMD",
                "Number of Pins": "37 pins",
                "Rating Temperature": "-40C ~ +85C",
                "Rating Voltage": "3.3V",
                "Size": "15.4mm x 20.5mm"
            },
            "type": "MCU",
            "category": "MCU",
            "footprint_image": "https://dev-edaapi.luxrobo.com/footprint/Footprint_ESP32-S3-MINI-1-N8.png",
            "option_names": {
                "AntennaBuiltIn": "Yes",
                "Bluetooth": "Yes",
                "DebugMCU": "UART",
                "GPIOHeader": "No",
                "ResetSwitch": "No",
                "SDCard": "No",
                "WiFi": "Yes"
            },
            "part_image": "https://www.mouser.kr/images/espressifsystems/images/ESP32-S3-MINI-1U-N8_SPL.jpg",
            "part_name": "ESP32-S3-MINI-1-N8",
            "symbol_image": "https://dev-edaapi.luxrobo.com/symbol/Symbol_ESP32-S3-MINI-1-N8.PNG",
            "index": 1
        },
        {
            "block_id": "7CgFDsKEVZZYfrFM9nE7YS",
            "color": "",
            "description": "Supercapacitors / Ultracapacitors 3V 3.3F 8X20mm Radial Low ESR",
            "icon": "/icons/spc.svg",
            "part_id": "WdyeHbwwt3XFgkfMnomdbS",
            "specification": null,
            "type": "SPC",
            "category": "Battery",
            "footprint_image": "",
            "option_names": {
                "Capacitance": "3.3F",
                "TargetVoltage": "5V"
            },
            "part_image": "https://www.mouser.com/images/avx/images/SCC_Series_DSL.jpg",
            "part_name": "SCCR20E335PRB",
            "symbol_image": "",
            "index": 2
        },
        {
            "block_id": "PD9ZVNRJ7y8nAGWrbpwCyN",
            "color": "",
            "description": "Standard LEDs - SMD White 78MCD",
            "icon": "/icons/led.svg",
            "part_id": "SDy8twMTnZ4dh2nVww7HFK",
            "specification": null,
            "type": "LED",
            "category": "Output",
            "footprint_image": "",
            "option_names": {
                "Color": "White",
                "LEDPower": "Standard LED",
                "MountingStyle": "SMD",
                "RatingVoltage": "5V",
                "Size": "Rect - Big",
                "UseDriver": "No"
            },
            "part_image": "https://www.mouser.com/images/liteon/images/LTST_C190_series_SPL.jpg",
            "part_name": "LTW-C191TS5",
            "symbol_image": "",
            "index": 1
        },
        {
            "block_id": "CQfUFTjRKzCgLMeuUQKMLe",
            "color": "",
            "description": "LDO Voltage Regulators Single 300mA LDO Enable Pull-Down",
            "icon": "/icons/converter.svg",
            "part_id": "3mpXZyCPYTvcTb36PeEHHc",
            "specification": null,
            "type": "LDO",
            "category": "Subpart",
            "footprint_image": "https://luxrobo-download.s3.ap-northeast-2.amazonaws.com/eda-part/Footprint_MIC5504-3.3YMT-TZ.png",
            "option_names": {
                "InputVoltage": "5",
                "MountingStyle": "SMD",
                "OutputCurrent": "0.3",
                "OutputVoltage": "3.3"
            },
            "part_image": "https://www.mouser.com/images/micrel/images/DFN_4_SPL.jpg",
            "part_name": "MIC5504-3.3YMT-TZ",
            "symbol_image": "https://luxrobo-download.s3.ap-northeast-2.amazonaws.com/eda-part/Symbol_MIC5504-3.3YMT-TZ.png",
            "index": 1
        },
        {
            "block_id": "QYfArubJqC7tpo5jhhXqcH",
            "color": "",
            "description": "Switching Voltage Regulators DCDC Conv HV Buck TSOT26(STD) T&R 3K",
            "icon": "/icons/converter.svg",
            "part_id": "B5JjxbWQeaarSUHJYfsqtb",
            "specification": null,
            "type": "Buck",
            "category": "Subpart",
            "footprint_image": "https://luxrobo-download.s3.ap-northeast-2.amazonaws.com/eda-part/Footprint_AP62200WU-7.png",
            "option_names": {
                "InputVoltage": "5",
                "MountingStyle": "SMD",
                "OutputCurrent": "1",
                "OutputVoltage": "5"
            },
            "part_image": "https://www.mouser.com/images/diodesinc/images/TSOT26-6_DSL.jpg",
            "part_name": "AP62200WU-7",
            "symbol_image": "https://luxrobo-download.s3.ap-northeast-2.amazonaws.com/eda-part/Symbol_AP62200WU-7.png",
            "index": 1
        }
    ],
    "links": [
        {
            "block_id": "fk79NZYdpr3pghCMR3nqnt",
            "target_blocks": [
                {
                    "link_status": true,
                    "target_block_id": "S7iqnUAV5pdKndZthoE82U"
                }
            ],
            "type": "GPS"
        },
        {
            "block_id": "Si3w7qTMwCHmZC2aKg68i6",
            "target_blocks": [
                {
                    "link_status": true,
                    "target_block_id": "S7iqnUAV5pdKndZthoE82U"
                }
            ],
            "type": "Inertial"
        },
        {
            "block_id": "3qhK63P8FrZjgmVG6pCoNa",
            "target_blocks": [
                {
                    "link_status": true,
                    "target_block_id": "S7iqnUAV5pdKndZthoE82U"
                }
            ],
            "type": "Matrix"
        },
        {
            "block_id": "g4tBnWuNe9YWPymWVmkjMm",
            "target_blocks": [
                {
                    "link_status": true,
                    "target_block_id": "Power"
                }
            ],
            "type": "SPC"
        },
        {
            "block_id": "mqMYM8ArJUoQTvWfMhPMfH",
            "target_blocks": [
                {
                    "link_status": true,
                    "target_block_id": "Power"
                }
            ],
            "type": "USBIn"
        },
        {
            "block_id": "S7iqnUAV5pdKndZthoE82U",
            "target_blocks": [],
            "type": "MCU"
        },
        {
            "block_id": "7CgFDsKEVZZYfrFM9nE7YS",
            "target_blocks": [
                {
                    "link_status": true,
                    "target_block_id": "Power"
                }
            ],
            "type": "SPC"
        },
        {
            "block_id": "PD9ZVNRJ7y8nAGWrbpwCyN",
            "target_blocks": [
                {
                    "link_status": true,
                    "target_block_id": "fk79NZYdpr3pghCMR3nqnt"
                },
                {
                    "link_status": false,
                    "target_block_id": "Si3w7qTMwCHmZC2aKg68i6"
                },
                {
                    "link_status": true,
                    "target_block_id": "3qhK63P8FrZjgmVG6pCoNa"
                },
                {
                    "link_status": true,
                    "target_block_id": "g4tBnWuNe9YWPymWVmkjMm"
                },
                {
                    "link_status": false,
                    "target_block_id": "mqMYM8ArJUoQTvWfMhPMfH"
                },
                {
                    "link_status": true,
                    "target_block_id": "S7iqnUAV5pdKndZthoE82U"
                },
                {
                    "link_status": false,
                    "target_block_id": "7CgFDsKEVZZYfrFM9nE7YS"
                },
                {
                    "link_status": false,
                    "target_block_id": "PD9ZVNRJ7y8nAGWrbpwCyN"
                }
            ],
            "type": "LED"
        }
    ]
}
`;

  const menuHooks = useDiagMenu()

  const [dragBlockId, setDragBlockId] = useState("");

  const props = {
    menuHooks,
    json,
    gridSize: 30,
    onUpdateJson: async (json: string) => {
      console.log(`updated json`)
    }, // CAUTION: layout 정보만 줌.
    width: 1800,
    height: 1000,
    onUndo: async () => {
      console.log("undo!!!")
    },
    onRedo: async () => {
      console.log("redo!!!")
    },
    onClick: async (id: string) => {
      console.log(`click!!! id: ${id}`)
    },
    onRelease: async () => {
      console.log(`Released: no selected block.`)
    },
    onSetting: async () => {
      console.log("setting!!!")
    },
    onPlaceBlock: async (id: string) => {
      console.log("place a block!!!")
    },
    onDeleteBlocks: async (ids: string[]) => {
      console.log(`delete blocks.`, ids)
    },
    onRightDown: async (e: PointerEvent) => {
      console.log(e)
      menuHooks.setZoomIn()
    },
    dragBlockId: ""
  };

  useEffect(() => {

    // setTimeout(() => {

    //   setDragBlockId("7");

    //   // setTimeout(() => {

    //   //   setDragBlockId("6");

    //   // }, 3000);

    // }, 1000);

    // console.log(blocks, board);

    // console.log(DiagBlockConst.testCD(blocks, board));

const    blocks =[
    {
        "block_id": "NUeWVJ4tGcMfNjMgYvwbtj",
        "index": "1",
        "category": "Input",
        "name": "LG77LICMD",
        "color": "",
        "part_id": "YVjTBxjT66967iTtvThZ92",
        "part_name": "LG77LICMD",
        "icon": "/icons/gps.svg",
        "type": "GPS",
        "is_updated": false,
        "layoutInfo": {
            "block_id": "NUeWVJ4tGcMfNjMgYvwbtj",
            "is_auto": false,
            "is_placed": true,
            "is_top": true,
            "out_shape_b": [
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                }
            ],
            "out_shape_t": [
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 370,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 370,
                    "y": 530,
                    "r": 0
                },
                {
                    "x": 0,
                    "y": 530,
                    "r": 0
                }
            ],
            "pos": {
                "x": 1860,
                "y": 430,
                "r": 0
            }
        }
    },
    {
        "block_id": "fNsbZ7N9KiY89zLfedt4oZ",
        "index": "1",
        "category": "Input",
        "name": "ICM-42670-P",
        "color": "",
        "part_id": "AawF4cXR7CUq8gtJvr9ZhZ",
        "part_name": "ICM-42670-P",
        "icon": "/icons/inertial.svg",
        "type": "Inertial",
        "is_updated": false,
        "layoutInfo": {
            "block_id": "fNsbZ7N9KiY89zLfedt4oZ",
            "is_auto": false,
            "is_placed": true,
            "is_top": true,
            "out_shape_b": [
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                }
            ],
            "out_shape_t": [
                {
                    "x": 0,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 200,
                    "y": 0,
                    "r": 0
                },
                {
                    "x": 200,
                    "y": 390,
                    "r": 0
                },
                {
                    "x": 0,
                    "y": 390,
                    "r": 0
                }
            ],
            "pos": {
                "x": 2380,
                "y": 480,
                "r": 0
            }
        }
    }
];

const    board=  [
            {
                "x": 0,
                "y": 0,
                "r": 0
            },
            {
                "x": 2500,
                "y": 0,
                "r": 0
            },
            {
                "x": 2500,
                "y": 3000,
                "r": 0
            },
            {
                "x": 0,
                "y": 3000,
                "r": 0
            }
        ];

    // console.log(blocks);
    // console.log(DiagBlockConst.testCD(blocks, board));

    // const src = { x: 100, y: 100 };
    // const center = { x: 50, y : 50};

    // console.log(DiagGeoUtil.rotate(src, center, 45));

  }, []);

  return (
    <div>
      {/* <LogicDiag
        menuHooks={menuHooks}
        json={logicJson}
        // json={logicJson}
        width={1800}
        height={1000}
        onUndo={async () => { console.log('undo!!!') }}
        onRedo={async () => { console.log('redo!!!') }}
        onCopy={async (id: string) => { console.log(`copy!!! id: ${id}`) }}
        onPaste={async () => { console.log(`pasted!!!`) }}
        onClick={async (id: string) => { console.log(`click!!! id: ${id}`) }}
        onRelease={async () => { console.log(`Released: no selected block.`) }}
        onRightDown={async (e: PointerEvent) => { console.log(e); }}
        onLink={async (blockId: string, targetBlockId: string) => { console.log(`new link: ${blockId} -> ${targetBlockId}`) }}
      /> */}
      <PowerDiag
        menuHooks={menuHooks}
        json={DiagTestUtil.powerJson()}
        // json={powerJson}
        width={1800}
        height={1000}
        onUndo={async () => { console.log('undo!!!') }}
        onRedo={async () => { console.log('redo!!!') }}
        onClick={async (id: string) => { console.log(`click!!! id: ${id}`) }}
        onRelease={async () => { console.log(`Released: no selected block.`) }}
        onRightDown={async (e: PointerEvent) => { console.log(e); }}
        onNetChanged={async (blockId: string, newNetName: string) => { console.log(`${blockId} -> ${newNetName}`) }}
      />

      {/* <LayoutDiag { ...props} dragBlockId={dragBlockId}>
      </LayoutDiag> */}

      {/* <TestDiag></TestDiag> */}

      {/* <div>
        <input type={'file'} onChange={onChange} />
      </div> */}
    </div>
  )
}

export default PixiTest
