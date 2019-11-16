import { ToastrService } from 'ngx-toastr';

export function removeDeletedItem(arrayOfItems: any, itemId: any) {
  const newItems = arrayOfItems;
  return newItems.filter((item: any) => {
    return item.id !== itemId;
  });
}

/**
 * Reusabel Error Method
 * @param error
 */
export function componentError(error: any, toastr: ToastrService) {
  //let errorMsg = JSON.parse(error);
  toastr.error(error, 'ERROR');
  console.log(` error: ${error}`);
  return;
}

export function serverError(error?: any, toastr?: ToastrService) {
  // const errorMsg = JSON.parse(message);

  if (error.status === 400) {
    componentError(error.message, toastr);
    return;
  }
  // toastr.error('Server Error', 'ERROR');
  console.log('serverError', error);
}
