import { JQueryGlobal, ICardConnectResponse } from './interfaces';

export default class WoocommereCardConnect {

  $ : JQueryGlobal;
  baseUrl : string;
  cardNumber : string;

  constructor(jQuery : JQueryGlobal, csApiEndpoint : string = ''){
    this.$ = jQuery;
    this.baseUrl = csApiEndpoint + '?action=CE&type=json';
  }

  public getToken = (number : string, callback : any) => {
    if(!this.validateCard(number))
      return callback(null, 'Invalid Credit Card Number');

    this.$.get(`${this.baseUrl}&data=${this.cardNumber}`)
      .done((data : string) => this.processRequest(data, callback))
      .fail((data: JQuery.jqXHR<any>) => {
        console.error('Failed to fetch token', data.responseJSON);
        callback(null, 'Failed to connect to server');
      });
  };

  private validateCard = (number : string) => {
    this.cardNumber = number;
    if (this.$.payment){
      return this.$.payment.validateCardNumber(this.cardNumber);
    }
    return this.cardNumber.length > 0;
  };

  private processRequest = (JSONPResponse : string, callback : Function) : void => {
    // processToken is invoked when the response from CC is passed through eval
    const processToken = (response: ICardConnectResponse) => {
      const { action, data } = response;
      if(action === 'CE') {
          return callback(data, null);
      }
      return callback(null, data);
    };
    eval(JSONPResponse);
  };

  private failedRequest = (JSONPResponse : string, callback : Function) : void =>
    callback(null, 'Failed to connect to server');

}
