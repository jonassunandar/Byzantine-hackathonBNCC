const helper = {
    formatMoney,
    showDate,
    showDateTime,
    validate,
    lang
  };
  
  function formatMoney(money= 0) {
      money = money.toString() + ',00'
      money = money.replace(/\d(?=(\d{3})+\,)/g, '$&.'); 
      return "Rp. "+ money
  }
  
  function showDate(date = new Date(), yearFirst) {
      date = new Date(date);
      if(yearFirst)
          return date.getFullYear()+ '-'+ (parseInt(date.getMonth()) +1 ).toString().padStart(2, '0')+ '-'+ date.getDate().toString().padStart(2, '0')
  
      return date.getDate().toString().padStart(2, '0')+ '-'+ (parseInt(date.getMonth()) +1 ).toString().padStart(2, '0')+ '-'+ date.getFullYear()
  }
  function showDateTime(date = new Date()) {
    date = new Date(date);
    return date.getFullYear()+ '-'+ (parseInt(date.getMonth()) +1 ).toString().padStart(2, '0')+ '-'+ date.getDate().toString().padStart(2, '0')
        + ' '+ date.getHours().toString().padStart(2, '0')+ ':' + date.getMinutes().toString().padStart(2, '0')+ ':'+ date.getSeconds().toString().padStart(2, '0')
}
  
  //options berupa object
  // {
  //     isRequired: Boolean,
  //     minLength:int,               //minimum length string
  //     maxLength:int,               //maximum length string
  //     max: int,                    //max number
  //     min: int,                    //min number
  //     typeof:string,
  //     inArray:array,
  //     inObject:Object,
  //     validEmail: boolean,
  //     confirm: string        //check if values are the same with other fields
  // }
  function validate(value, options = {}, lang='indo') {
        let err = false;
    
        //is value contain a valid email address format
        if(options.validEmail)
            err = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? false : 'Email tidak valid';
            
        //isRequired
        if(options.isRequired && (!value || value == '')) 
            err = `Form ${options.label || options.key} harus di isi !`;
    
        if(options.min && parseInt(value) < options.min)
            err = `Form ${options.label || options.key} harus lebih besar dari ${options.min}`
        if(options.max && parseInt(value) < options.max)
            err = `Form ${options.label || options.key} harus lebih kecil dari ${options.max}`
        if(options.minLength && value.length < options.minLength)
            err = `Panjang Form ${options.label || options.key} harus lebih besar dari ${options.minLength}`
        if(options.maxLength && value.lengt < options.maxLength)
            err = `Panjang Form ${options.label || options.key} harus lebih kecil dari ${options.maxLength}`
        if(options.isObject){
            if(!value[options.requiredKey])
                err = `Form ${options.label || options.key} harus di dipilih !`;
        }
    
      
      return err
  }
  
function lang(language){
    if (!language) language = 'indo';

    return function lang(indo, eng = false){
        if(language !== 'indo' && eng)
            return eng
        return indo
    }
}

  export default helper;