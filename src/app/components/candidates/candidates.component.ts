import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../services/candidate.service';
import { Candidate } from '../../models/candidate.model';


@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  selectedCandidate: Candidate = { id: 0, name: '', appliedPosition: '', companyId: 0 };
  displayedColumns: string[] = ['name', 'appliedPosition', 'companyId', 'actions'];

  constructor(private candidateService: CandidateService) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    this.candidateService.getCandidates().subscribe(data => this.candidates = data);
  }

  onSubmit() {
    if (this.selectedCandidate.id) {
      this.candidateService.updateCandidate(this.selectedCandidate).subscribe(() => this.loadCandidates());
    } else {
      this.candidateService.addCandidate(this.selectedCandidate).subscribe(() => this.loadCandidates());
    }
    this.clearForm();
  }

  editCandidate(candidate: Candidate) {
    this.selectedCandidate = { ...candidate };
  }

  deleteCandidate(id: number) {
    this.candidateService.deleteCandidate(id).subscribe(() => this.loadCandidates());
  }

  clearForm() {
    this.selectedCandidate = { id: 0, name: '', appliedPosition: '', companyId: 0 };
  }
}
