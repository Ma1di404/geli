import {NgModule} from '@angular/core';
import {ConfirmDialog} from '../components/confirm-dialog/confirm-dialog.component';
import {AccessKeyDialog} from '../components/access-key-dialog/access-key-dialog.component';
import {FilepickerDialog} from '../components/filepicker-dialog/filepicker-dialog.component';
import {DialogService} from '../services/dialog.service';
import {FormsModule} from '@angular/forms';
import {UploadDialog} from '../components/upload-dialog/upload-dialog.component';
import {WriteMailDialog} from '../components/write-mail-dialog/write-mail-dialog.component';
import {FileUploadModule} from 'ng2-file-upload';
import {CommonModule} from '@angular/common';
import {MaterialImportModule} from './material-import.module';
import {InfoDialog} from '../components/info-dialog/info-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    MaterialImportModule,
  ],
  exports: [
    InfoDialog,
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
    WriteMailDialog,
  ],
  declarations: [
    InfoDialog,
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
    WriteMailDialog,
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    InfoDialog,
    ConfirmDialog,
    AccessKeyDialog,
    UploadDialog,
    FilepickerDialog,
    WriteMailDialog,
  ]
})
export class DialogModule {
}