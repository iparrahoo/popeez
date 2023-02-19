import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { read } from 'fs';
import { IStudent } from 'src/app/shared/models/student.model';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) public sort: MatSort | undefined;

    public displayedColumns: string[] = ['present', 'name', 'male'];
    public dataSource: MatTableDataSource<IStudent> = new MatTableDataSource<IStudent>();
    public students: IStudent[] = [];

    constructor() { }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void {
        if (this.sort) this.dataSource.sort = this.sort;
    }

    public applyFilter(event: any): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    public readExcelSheet(event: any): void {
        const file: File = event.target.files[0];

        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e: any) => {
            const binarystr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

            // -- Get the first sheet.
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            // -- Copy list of students.
            const data: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
            this.students = this.getStudentsFromExcelSheet(data, 'Bayragee');
            this.dataSource.data = this.students;
        };
    }

    public setPresent(student: IStudent): void {
        student.present = !student.present;
    }

    private getStudentsFromExcelSheet(data: string[][], teacherName: string): IStudent[] {
        const students: IStudent[] = [];

        // -- First, look for the teacher name.
        let boyColumn = -1;
        let boyRow = -1;
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (!row.some(cell => cell !== '')) continue;

            // -- If the teacher is found, look for the row contains 'Boys'.
            if (boyColumn !== - 1) {

                // -- Get the next row as starting student names and stop loop.
                if (row[boyColumn].includes('Boys')) {
                    boyRow = i + 1;
                    break;
                }
                continue;
            }

            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell === '' || typeof cell === 'number') continue;

                // -- Teacher is found.
                if (cell.includes('Teacher') && cell.toLowerCase().includes(teacherName.toLowerCase())) {
                    boyColumn = j;
                    break;
                }
            }
        }

        // -- Retrieve students.
        let male = true;
        for (let i = boyRow; i < data.length; i++) {
            const cell = data[i][boyColumn];

            // -- If girls students are already retrieved, stop looping.
            if (cell === '') {
                if (!male) break;
                continue;
            }

            // -- Check to female when girls row reach.
            if (cell.includes('Girls')) {
                male = false;
                continue;
            }

            // -- Add students to list.
            const student: IStudent = {
                name: cell,
                male,
                present: false
            };
            students.push(student);
        }

        return students;
    }

}
