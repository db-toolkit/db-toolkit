import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Controls.Material 2.15
import QtQuick.Layouts 1.15
import DBToolkit 1.0

Rectangle {
    id: root
    color: Material.color(Material.Grey, Material.Shade50)
    
    property string connectionId: ""
    
    SchemaController {
        id: schemaController
    }
    
    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 10
        spacing: 10
        
        // Header
        RowLayout {
            Layout.fillWidth: true
            
            Text {
                text: "Schema Explorer"
                font.pixelSize: 16
                font.bold: true
                Layout.fillWidth: true
            }
            
            Button {
                text: "Refresh"
                enabled: !schemaController.loading && root.connectionId !== ""
                onClicked: schemaController.refresh_schema()
            }
        }
        
        // Loading indicator
        Rectangle {
            Layout.fillWidth: true
            height: 40
            visible: schemaController.loading
            color: Material.color(Material.Blue, Material.Shade100)
            radius: 4
            
            RowLayout {
                anchors.centerIn: parent
                spacing: 10
                
                BusyIndicator {
                    running: schemaController.loading
                    Material.accent: Material.Blue
                }
                
                Text {
                    text: "Loading schema..."
                    color: Material.color(Material.Blue)
                }
            }
        }
        
        // Error message
        Rectangle {
            Layout.fillWidth: true
            height: 40
            visible: schemaController.error !== ""
            color: Material.color(Material.Red, Material.Shade100)
            radius: 4
            
            Text {
                anchors.centerIn: parent
                text: schemaController.error
                color: Material.color(Material.Red)
                wrapMode: Text.WordWrap
            }
        }
        
        // Schema tree view
        ScrollView {
            Layout.fillWidth: true
            Layout.fillHeight: true
            
            TreeView {
                id: treeView
                anchors.fill: parent
                model: schemaController.schemaModel
                
                delegate: Rectangle {
                    id: treeDelegate
                    
                    required property TreeView treeView
                    required property bool isTreeNode
                    required property bool expanded
                    required property int hasChildren
                    required property int depth
                    
                    implicitWidth: treeView.width > 0 ? treeView.width : 250
                    implicitHeight: 35
                    
                    color: "transparent"
                    
                    Rectangle {
                        anchors.fill: parent
                        anchors.margins: 1
                        color: mouseArea.containsMouse ? Material.color(Material.Grey, Material.Shade200) : "transparent"
                        radius: 4
                        
                        RowLayout {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.leftMargin: 10 + (treeDelegate.depth * 20)
                            anchors.rightMargin: 10
                            spacing: 8
                            
                            // Expand/collapse indicator
                            Text {
                                text: treeDelegate.hasChildren > 0 ? (treeDelegate.expanded ? "▼" : "▶") : "  "
                                font.pixelSize: 12
                                color: Material.color(Material.Grey)
                                Layout.preferredWidth: 15
                            }
                            
                            // Icon based on type
                            Text {
                                text: getIcon()
                                font.pixelSize: 14
                                color: getIconColor()
                                
                                function getIcon() {
                                    if (model && model.type) {
                                        switch(model.type) {
                                            case "schema": return "🗂️"
                                            case "table": return "📋"
                                            case "column": return "📄"
                                            default: return "📁"
                                        }
                                    }
                                    return "📁"
                                }
                                
                                function getIconColor() {
                                    if (model && model.type) {
                                        switch(model.type) {
                                            case "schema": return Material.color(Material.Blue)
                                            case "table": return Material.color(Material.Green)
                                            case "column": return Material.color(Material.Orange)
                                            default: return Material.color(Material.Grey)
                                        }
                                    }
                                    return Material.color(Material.Grey)
                                }
                            }
                            
                            // Name
                            Text {
                                text: model ? (model.name || "") : ""
                                font.pixelSize: 13
                                Layout.fillWidth: true
                                elide: Text.ElideRight
                            }
                            
                            // Data type for columns
                            Text {
                                text: model && model.data_type ? model.data_type : ""
                                font.pixelSize: 11
                                color: Material.color(Material.Grey)
                                visible: model && model.type === "column"
                            }
                        }
                        
                        MouseArea {
                            id: mouseArea
                            anchors.fill: parent
                            hoverEnabled: true
                            
                            onClicked: {
                                if (treeDelegate.hasChildren > 0) {
                                    treeView.toggleExpanded(row)
                                }
                            }
                            
                            onDoubleClicked: {
                                if (model && model.type === "table") {
                                    console.log("Double-clicked table:", model.name)
                                    // TODO: Load table data
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Empty state
        Rectangle {
            Layout.fillWidth: true
            Layout.fillHeight: true
            visible: !schemaController.loading && schemaController.error === "" && root.connectionId === ""
            color: "transparent"
            
            ColumnLayout {
                anchors.centerIn: parent
                spacing: 15
                
                Text {
                    text: "🔍"
                    font.pixelSize: 48
                    Layout.alignment: Qt.AlignHCenter
                }
                
                Text {
                    text: "Select a connection to explore schema"
                    font.pixelSize: 14
                    color: Material.color(Material.Grey)
                    Layout.alignment: Qt.AlignHCenter
                }
            }
        }
    }
    
    onConnectionIdChanged: {
        if (connectionId !== "") {
            schemaController.load_schema(connectionId)
        }
    }
}