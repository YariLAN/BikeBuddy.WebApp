import Swal, { SweetAlertIcon, SweetAlertPosition } from "sweetalert2";

function errorText(err : Object): string{
    if (typeof err === 'object' && err !== null && 'data' in err  && 'status' in err) {
        var e = err as any;
        var objData = JSON.stringify(e.data);
        objData = objData.replace(new RegExp('\\\\r\\\\n', 'g'),"<br/>");
        objData = objData.replace(new RegExp('\\\\r', 'g'),"<br/>");
        objData = objData.replace(new RegExp('\\\\n', 'g'),"<br/>");
        const message = `api call error ${new Date().toLocaleString()}<br/>status:${(err as any).status}<br/>${objData}`;
        return message;
    }
    let msg = '' + new Date();
    for(var p in (err as any)){
        msg = msg + '<br/>' + (err as any)[p]; 
    }
    return msg;
}

export function alertError(e : any){
    console.error('Error', e, typeof e);
    Swal.fire({
      title: "Ошибка",
      html: errorText(e),
      buttonsStyling: true,
      confirmButtonText: "Закрыть",
      customClass: {
        confirmButton: "btn btn-danger",
        popup: "swal-alert-error",
      }
    })
}

export function alertExpectedError(message : string){
    Swal.fire({
      title: "Ошибка",
      text: message,
      icon: 'error',
      buttonsStyling: true,
      confirmButtonText: "Закрыть",
      customClass: {
        confirmButton: "btn btn-danger",
        popup: "swal-alert-info"
      }
    })
}

export function alertInfo(text : string, title: string, type: SweetAlertIcon){
    Swal.fire({
      title: title || "Сообщение",
      html: text,
      icon: type,
      buttonsStyling: true,
      confirmButtonText: "Закрыть",
      customClass: {
        confirmButton: "btn btn-danger",
        popup: "swal-alert-info"
      }
  })
}
export function toastAlert(text : string, title: string, type: SweetAlertIcon, position: SweetAlertPosition = "bottom-end"){
   const Toast =  Swal.mixin({
      position: position,
      timer: 3000,
      toast: true,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      width: 400,
  })
  Toast.fire({
    title: title || "Сообщение",
    html: text,
    icon: type,
    buttonsStyling: true,
    confirmButtonText: "Закрыть",
    customClass: {
      confirmButton: "btn btn-danger",
      popup: "swal-alert-info"
    },
    heightAuto: true
  });
}

  export default {
    errorText,
    alertError,
    alertInfo,
    toastAlert
  }