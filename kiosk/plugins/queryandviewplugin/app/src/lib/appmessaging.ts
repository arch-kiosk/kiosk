import {LitElement} from 'lit-element';
// import {kioskErrorToast, kioskSuccessToast} from '../lib/types/externalglobalfunctions'

export const MSG_SEVERITY_CRITICAL = 10
export const MSG_SEVERITY_ERROR = 5
export const MSG_SEVERITY_WARNING = 5
export const MSG_SEVERITY_INFO = 0
export const MSG_SEVERITY_DEBUG = -10

export const MSG_LOGGED_OUT = "MSG_LOGGED_OUT"
export const MSG_NETWORK_ERROR = "MSG_NETWORK_ERROR"

class MESSAGE_DETAIL {
    severity: number

    constructor(severity: number) {
        this.severity = severity
    }
}

let MESSAGE_ID_DETAILS: { [key: string]: MESSAGE_DETAIL } = {
    "MSG_LOGGED_OUT": {
        "severity": 10
    },
    "MSG_NETWORK_ERROR": {
        "severity": 10
    },
}

export class MessageData {
    messageId: string
    headline: string
    body: string

    constructor(messageId: string, headline: string, body: string = "") {
        this.messageId = messageId
        this.headline = headline
        this.body = body
    }
}

export function sendMessage(senderInstance: LitElement, messageId: string, headline: string, body: string = "") {
    let messageData = new MessageData(
        messageId,
        headline,
        body)

    senderInstance.dispatchEvent(new CustomEvent("send-message",
        {bubbles: true, composed: true, detail: messageData}));
}

// export function showMessage(messageList: { [key: string]: object }, messageData: MessageData,
//                             onClose: CallableFunction = null, deleteOnClose = false) {
//     if (!(messageData.messageId in messageList)) {
//         let messageDetails = MESSAGE_ID_DETAILS[messageData.messageId]
//         let options = {}
//         if (onClose) {
//             options = {
//                 onClosing: onClose
//             }
//         } else {
//             if (deleteOnClose) {
//                 options = {
//                     onClosing: () => {
//                         deleteMessage(messageList, messageData.messageId)
//                     }
//                 }
//             }
//         }
//         if (messageDetails.severity >= MSG_SEVERITY_ERROR) {
//             messageList[messageData.messageId] = messageData
//             kioskErrorToast("<strong>" + messageData.headline + "</strong><br><br>" + messageData.body, options);
//         } else {
//             if (messageDetails.severity >= MSG_SEVERITY_INFO) {
//                 messageList[messageData.messageId] = messageData
//                 kioskSuccessToast("<strong>" + messageData.headline + "</strong><br><br>" + messageData.body, options);
//             }
//         }
//     }
// }

export function deleteMessage(messageList: { [key: string]: object }, messageId: string) {
    // console.log(`deleting message ${messageId}`)
    if (messageId in messageList) {
        delete messageList[messageId]
    }
}