import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Controls.Material 2.15
import QtQuick.Layouts 1.15
import Qt5Compat.GraphicalEffects
import DBToolkit 1.0

ApplicationWindow {
    id: window
    width: 1200
    height: 800
    visible: true
    title: "DB Toolkit"
    
    Material.theme: Material.Light
    Material.primary: Material.Indigo
    Material.accent: Material.Teal
    
    // Background gradient
    Rectangle {
        anchors.fill: parent
        gradient: Gradient {
            GradientStop { position: 0.0; color: "#f8fafc" }
            GradientStop { position: 1.0; color: "#e2e8f0" }
        }
    }
    
    property string selectedConnectionId: ""
    
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
            color: "white"
            radius: 12
            
            // Drop shadow effect
            layer.enabled: true
            layer.effect: DropShadow {
                horizontalOffset: 0
                verticalOffset: 2
                radius: 8
                samples: 16
                color: "#20000000"
            }
            
            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 15
                spacing: 10
                
                // Header with gradient
                Rectangle {
                    Layout.fillWidth: true
                    height: 60
                    radius: 8
                    gradient: Gradient {
                        GradientStop { position: 0.0; color: Material.color(Material.Indigo) }
                        GradientStop { position: 1.0; color: Material.color(Material.Indigo, Material.Shade700) }
                    }
                    
                    RowLayout {
                        anchors.fill: parent
                        anchors.margins: 15
                        
                        Text {
                            text: "🔗 Connections"
                            font.pixelSize: 18
                            font.bold: true
                            color: "white"
                            Layout.fillWidth: true
                        }
                        
                        Button {
                            text: "+"
                            font.bold: true
                            Material.background: "white"
                            Material.foreground: Material.color(Material.Indigo)
                            onClicked: connectionDialog.open()
                            
                            // Hover animation
                            scale: mouseArea.containsMouse ? 1.05 : 1.0
                            Behavior on scale { NumberAnimation { duration: 150 } }
                            
                            MouseArea {
                                id: mouseArea
                                anchors.fill: parent
                                hoverEnabled: true
                                onClicked: parent.clicked()
                            }
                        }
                    }
                }
                
                ListView {
                    id: connectionsList
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    model: connectionController.connections
                    spacing: 8
                    
                    delegate: Rectangle {
                        width: connectionsList.width - 10
                        height: 70
                        anchors.horizontalCenter: parent.horizontalCenter
                        color: selectedConnectionId === modelData.id ? Material.color(Material.Indigo, Material.Shade50) : "white"
                        border.color: selectedConnectionId === modelData.id ? Material.color(Material.Indigo, Material.Shade200) : Material.color(Material.Grey, Material.Shade200)
                        border.width: selectedConnectionId === modelData.id ? 2 : 1
                        radius: 8
                        
                        // Hover and selection effects
                        scale: mouseArea.containsMouse ? 1.02 : 1.0
                        Behavior on scale { NumberAnimation { duration: 150 } }
                        Behavior on color { ColorAnimation { duration: 200 } }
                        Behavior on border.color { ColorAnimation { duration: 200 } }
                        
                        // Connection status indicator
                        Rectangle {
                            width: 8
                            height: 8
                            radius: 4
                            color: Material.color(Material.Green)
                            anchors.right: parent.right
                            anchors.top: parent.top
                            anchors.margins: 8
                        }
                        
                        RowLayout {
                            anchors.fill: parent
                            anchors.margins: 12
                            spacing: 12
                            
                            // Database type icon
                            Rectangle {
                                width: 40
                                height: 40
                                radius: 20
                                color: getDbColor()
                                
                                Text {
                                    anchors.centerIn: parent
                                    text: getDbIcon()
                                    font.pixelSize: 18
                                    color: "white"
                                }
                                
                                function getDbIcon() {
                                    switch(modelData.db_type) {
                                        case "postgresql": return "🐘"
                                        case "mysql": return "🐬"
                                        case "sqlite": return "🗄"
                                        case "mongodb": return "🍃"
                                        default: return "📊"
                                    }
                                }
                                
                                function getDbColor() {
                                    switch(modelData.db_type) {
                                        case "postgresql": return "#336791"
                                        case "mysql": return "#00758f"
                                        case "sqlite": return "#003b57"
                                        case "mongodb": return "#4db33d"
                                        default: return Material.color(Material.Grey)
                                    }
                                }
                            }
                            
                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 4
                                
                                Text {
                                    text: modelData.name
                                    font.bold: true
                                    font.pixelSize: 14
                                    color: selectedConnectionId === modelData.id ? Material.color(Material.Indigo) : "#1a202c"
                                }
                                
                                Text {
                                    text: modelData.db_type.toUpperCase() + " • " + (modelData.host || modelData.file_path || "")
                                    font.pixelSize: 11
                                    color: Material.color(Material.Grey, Material.Shade600)
                                    elide: Text.ElideRight
                                    Layout.fillWidth: true
                                }
                            }
                        }
                        
                        MouseArea {
                            id: mouseArea
                            anchors.fill: parent
                            hoverEnabled: true
                            onClicked: {
                                selectedConnectionId = modelData.id
                                connectionController.test_connection(modelData.id)
                            }
                        }
                    }
                }
            }
        }
        
        // Main content area
        RowLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            spacing: 10
            
            // Schema Explorer
            SchemaExplorer {
                id: schemaExplorer
                Layout.preferredWidth: 350
                Layout.fillHeight: true
                connectionId: selectedConnectionId
            }
            
            // Query/Data area
            Rectangle {
                Layout.fillWidth: true
                Layout.fillHeight: true
                color: "white"
                radius: 12
                
                // Drop shadow
                layer.enabled: true
                layer.effect: DropShadow {
                    horizontalOffset: 0
                    verticalOffset: 2
                    radius: 8
                    samples: 16
                    color: "#20000000"
                }
                
                ColumnLayout {
                    anchors.centerIn: parent
                    spacing: 30
                    
                    // Icon
                    Rectangle {
                        width: 80
                        height: 80
                        radius: 40
                        color: selectedConnectionId ? Material.color(Material.Teal, Material.Shade100) : Material.color(Material.Grey, Material.Shade100)
                        Layout.alignment: Qt.AlignHCenter
                        
                        Text {
                            anchors.centerIn: parent
                            text: selectedConnectionId ? "⚡" : "📝"
                            font.pixelSize: 32
                        }
                        
                        // Pulse animation when connected
                        SequentialAnimation on scale {
                            running: selectedConnectionId !== ""
                            loops: Animation.Infinite
                            NumberAnimation { to: 1.1; duration: 1000; easing.type: Easing.InOutQuad }
                            NumberAnimation { to: 1.0; duration: 1000; easing.type: Easing.InOutQuad }
                        }
                    }
                    
                    Text {
                        text: "Query Editor"
                        font.pixelSize: 28
                        font.bold: true
                        color: "#1a202c"
                        Layout.alignment: Qt.AlignHCenter
                    }
                    
                    Text {
                        text: selectedConnectionId ? "✨ Ready to execute queries" : "🔗 Select a connection to get started"
                        font.pixelSize: 16
                        color: Material.color(Material.Grey, Material.Shade600)
                        Layout.alignment: Qt.AlignHCenter
                    }
                    
                    // Action button
                    Button {
                        text: selectedConnectionId ? "Open Query Editor" : "Add Connection"
                        Material.background: selectedConnectionId ? Material.color(Material.Teal) : Material.color(Material.Indigo)
                        Material.foreground: "white"
                        font.bold: true
                        Layout.alignment: Qt.AlignHCenter
                        enabled: true
                        
                        onClicked: {
                            if (selectedConnectionId) {
                                console.log("Open query editor for:", selectedConnectionId)
                            } else {
                                connectionDialog.open()
                            }
                        }
                        
                        // Hover effect
                        scale: hovered ? 1.05 : 1.0
                        Behavior on scale { NumberAnimation { duration: 150 } }
                    }
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