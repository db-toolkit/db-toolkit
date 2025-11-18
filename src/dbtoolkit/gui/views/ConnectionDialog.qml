import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Controls.Material 2.15
import QtQuick.Layouts 1.15

Dialog {
    id: dialog
    title: "Add Database Connection"
    modal: true
    width: 500
    height: 600
    
    property alias connectionName: nameField.text
    property alias databaseType: typeCombo.currentText
    property alias host: hostField.text
    property alias port: portField.text
    property alias username: usernameField.text
    property alias password: passwordField.text
    property alias database: databaseField.text
    property alias filePath: filePathField.text
    
    signal connectionAdded(string name, string dbType, string host, string username, 
                          int port, string password, string database, string filePath)
    
    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 20
        spacing: 15
        
        TextField {
            id: nameField
            placeholderText: "Connection Name"
            Layout.fillWidth: true
        }
        
        ComboBox {
            id: typeCombo
            Layout.fillWidth: true
            model: ["postgresql", "mysql", "sqlite", "mongodb"]
            currentIndex: 0
        }
        
        TextField {
            id: hostField
            placeholderText: "Host"
            text: "localhost"
            Layout.fillWidth: true
            enabled: typeCombo.currentText !== "sqlite"
        }
        
        TextField {
            id: portField
            placeholderText: "Port"
            text: getDefaultPort()
            Layout.fillWidth: true
            enabled: typeCombo.currentText !== "sqlite"
            validator: IntValidator { bottom: 1; top: 65535 }
            
            function getDefaultPort() {
                switch(typeCombo.currentText) {
                    case "postgresql": return "5432"
                    case "mysql": return "3306"
                    case "mongodb": return "27017"
                    default: return ""
                }
            }
        }
        
        TextField {
            id: usernameField
            placeholderText: "Username"
            Layout.fillWidth: true
            enabled: typeCombo.currentText !== "sqlite"
        }
        
        TextField {
            id: passwordField
            placeholderText: "Password"
            echoMode: TextInput.Password
            Layout.fillWidth: true
            enabled: typeCombo.currentText !== "sqlite"
        }
        
        TextField {
            id: databaseField
            placeholderText: "Database Name"
            Layout.fillWidth: true
            enabled: typeCombo.currentText !== "sqlite"
        }
        
        TextField {
            id: filePathField
            placeholderText: "SQLite File Path"
            Layout.fillWidth: true
            enabled: typeCombo.currentText === "sqlite"
        }
        
        Item {
            Layout.fillHeight: true
        }
    }
    
    standardButtons: Dialog.Ok | Dialog.Cancel
    
    onAccepted: {
        connectionAdded(
            nameField.text,
            typeCombo.currentText,
            hostField.text,
            usernameField.text,
            parseInt(portField.text) || 0,
            passwordField.text,
            databaseField.text,
            filePathField.text
        )
    }
    
    onOpened: {
        nameField.forceActiveFocus()
    }
}