import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Controls.Material 2.15
import QtQuick.Layouts 1.15
import DBToolkit 1.0

ApplicationWindow {
    id: window
    width: 1200
    height: 800
    visible: true
    title: "DB Toolkit"
    
    Material.theme: Material.Light
    Material.primary: Material.Blue
    
    ConnectionController {
        id: connectionController
    }
    
    RowLayout {
        anchors.fill: parent
        anchors.margins: 10
        spacing: 10
        
        // Left panel - Connections
        Rectangle {
            Layout.preferredWidth: 300
            Layout.fillHeight: true
            color: Material.color(Material.Grey, Material.Shade100)
            radius: 8
            
            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 15
                spacing: 10
                
                RowLayout {
                    Layout.fillWidth: true
                    
                    Text {
                        text: "Connections"
                        font.pixelSize: 18
                        font.bold: true
                        Layout.fillWidth: true
                    }
                    
                    Button {
                        text: "+"
                        onClicked: connectionDialog.open()
                    }
                }
                
                ListView {
                    id: connectionsList
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    model: connectionController.connections
                    
                    delegate: Rectangle {
                        width: connectionsList.width
                        height: 60
                        color: "transparent"
                        border.color: Material.color(Material.Grey, Material.Shade300)
                        border.width: 1
                        radius: 4
                        
                        ColumnLayout {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.margins: 10
                            
                            Text {
                                text: modelData.name
                                font.bold: true
                            }
                            
                            Text {
                                text: modelData.db_type + " - " + (modelData.host || modelData.file_path || "")
                                font.pixelSize: 12
                                color: Material.color(Material.Grey)
                            }
                        }
                        
                        MouseArea {
                            anchors.fill: parent
                            onClicked: {
                                connectionController.test_connection(modelData.id)
                            }
                        }
                    }
                }
            }
        }
        
        // Main content area
        Rectangle {
            Layout.fillWidth: true
            Layout.fillHeight: true
            color: "white"
            radius: 8
            
            ColumnLayout {
                anchors.centerIn: parent
                spacing: 20
                
                Text {
                    text: "DB Toolkit"
                    font.pixelSize: 32
                    font.bold: true
                    Layout.alignment: Qt.AlignHCenter
                }
                
                Text {
                    text: "Select a connection to get started"
                    font.pixelSize: 16
                    color: Material.color(Material.Grey)
                    Layout.alignment: Qt.AlignHCenter
                }
            }
        }
    }
    
    ConnectionDialog {
        id: connectionDialog
        anchors.centerIn: parent
        
        onConnectionAdded: {
            connectionController.add_connection(name, dbType, host, username, port, password, database, filePath)
            connectionDialog.close()
        }
    }
    
    Connections {
        target: connectionController
        function onConnectionTestResult(success, message) {
            console.log("Connection test:", success, message)
        }
    }
}