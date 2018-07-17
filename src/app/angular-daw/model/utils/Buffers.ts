export class Buffers{
  static getAudioBuffer(blob: Blob,context:AudioContext): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      Buffers.convertToArrayBuffer(blob).then(result => {
        context.decodeAudioData(result, (buffer) => {
          resolve(buffer);
        })
      })
    });


  }

  static convertToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {

    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsArrayBuffer(blob);
    });


  }
}
