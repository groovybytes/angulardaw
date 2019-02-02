export class Lang {
  static getEnumKeys(enumType: any): Array<string> {
    return Object.keys(enumType).filter(k => typeof enumType[k as any] === "number");
  }
  static getEnumValues(enumType: any): Array<string> {
    return Object.keys(enumType).map(k => enumType[k as any]);
  }

  static  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
