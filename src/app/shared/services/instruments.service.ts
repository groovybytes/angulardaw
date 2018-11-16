import {FilesApi} from "../../api/files.api";
import {AppConfiguration} from "../../app.configuration";
import {SamplesApi} from "../../api/samples.api";
import {Notes} from "../../model/daw/Notes";

export class InstrumentsService{
  constructor(
    protected notes: Notes,
    private fileService: FilesApi,
    private config: AppConfiguration,
    private samplesV2Service: SamplesApi) {
  }

}
