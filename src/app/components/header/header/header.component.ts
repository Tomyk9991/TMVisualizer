import {Component, OnInit} from '@angular/core';
import constructFromString from "../../../../model/TM/TMParser";
import {TMRendererService} from "../../../services/t-m-renderer.service";
import TuringMachine from "../../../../model/TM/TuringMachine";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    constructor(private tmRendererService: TMRendererService) {

    }

    ngOnInit(): void {
        // TODO Debug
        let target: string =
            "# Informationen zum Abgabeformat\n" +
            "# Informationen zum Abgabeformat\n" +
            "# \n" +
            "# Zeilen die mit einem '#' beginnen werden als Kommentare verstanden. Diese können Sie selbst\n" +
            "# hinzufügen und erweitern. Diese können auch \"inline\" hinzugefügt werden.\n" +
            "# \n" +
            "# Alles nach der Zeile mit dem Token\t\"\"\"Abgabe:\"\"\"\t   wird zu Ihrer Lösung gezählt.\n" +
            "# Schreiben oder ändern Sie vor diesem Token nichts außer Kommentare und wo gefordert Ihren Namen und den \n" +
            "# Ihrer Gruppenmitglieder!\n" +
            "#\n" +
            "# Sie können Ihre Abgabe auf das richtige Format mit Hilfe des 'Submission-Tester' (siehe Moodle Kurs) testen.\n" +
            "# Abgaben die nicht das richtige Format einhalten werden nicht korrigiert! \n" +
            "# Nutzen Sie deshalb den Submission Tester vor direkt vor Abgabe Ihrer Lösung nocheinmal.\n" +
            "#\n" +
            "#\n" +
            "#\n" +
            "#\n" +
            "# Passen Sie folgende Zeilen an: Name, Gruppenmitglieder\n" +
            "\n" +
            "\"\"\"\n" +
            "Name = Alan Turing\t\t\t\t\t\t\t\t\t\t# Geben Sie rechts von '=' den vollständigen Namen der abgebenden Person an. Bsp: Name = Camila Cool\n" +
            "Gruppenmitglieder =\t\t\t\t\t\t\t# Geben Sie rechts von '=' die vollständigen Namen >aller< anderen Gruppenmitglieder durch ',' getrennt an. Bsp: Gruppenmitglieder = Theodore Theory, Ivy Incognito\n" +
            "Aufgabe = example\t\t\t\t\t\t\t# In dieser Zeile nichts verändern!\n" +
            "Aufgabentyp = turingmachine\t\t\t\t\t# In dieser Zeile nichts verändern!\n" +
            "\"\"\"\n" +
            "\n" +
            "\n" +
            "# Informationen zu Turingmaschinen-Aufgaben:\n" +
            "#\n" +
            "# Die Reihenfolge der Schlüsselwörter (input_alphabet, transitions, start_state, acc_state) darf nicht verändert werden!\n" +
            "# In Zustandsnamen dürfen keine Sonderzeichen, bis auf den Unterstrich, vorkommen. \n" +
            "#\n" +
            "# Das Arbeitsalphabet muss nicht angegeben werden. Dieses ergibt sich aus den Zeichen in der Transitionsfunktion, die keine Eingabezeichen sind.\n" +
            "# Als Blanksymbol muss immer der Unterstrich benutzt werden: _\n" +
            "#\n" +
            "# Die Transitionsfunktion darf partiell angegeben werden. Die Maschine wird durch den Interpreter automatisch vervollständigt, d.h. nicht definierte Übergänge werden in den Zustand !error_state! geleitet.\n" +
            "#\n" +
            "\"\"\"Abgabe:\"\"\"\n" +
            "\n" +
            "# Geben Sie hier das Eingabealphabet an.\n" +
            "input_alphabet = \ta,b,c\n" +
            "\n" +
            "# Geben Sie hier die Transitionen an.\n" +
            "transitions =\t\t\t\t\tq_0, $      -> q_0 , $, R\n" +
            "\t\t\t\t\tq_0, _      -> q_e , _, N\t\n" +
            "\t\t\t\t\tq_0, a      -> q_1 , b, R\t\n" +
            "\t\t  \n" +
            "\t\t\t\t\tq_1, $      -> q_1 , $, R\t\n" +
            "\t\t\t\t\tq_1, a      -> q_1 , a, R\n" +
            "\t\t\t\t\tq_1, b      -> q_2 , $, R\n" +
            "\n" +
            "\t\t\t\t\tq_2, $      -> q_2 , $, R\t\n" +
            "\t\t\t\t\tq_2, b      -> q_2 , b, R\n" +
            "\t\t\t\t\tq_2, c      -> q_back , $, N\n" +
            "\n" +
            "\t\t\t\t\tq_back, $   -> q_back , $, L\t\n" +
            "\t\t\t\t\tq_back, a   -> q_back , a, L\n" +
            "\t\t\t\t\tq_back, b   -> q_back , b', L\n" +
            "\t\t\t\t\tq_back, c   -> q_back , c', L\n" +
            "\t\t\t\t\tq_back, _   -> q_0 , _, R\n" +
            "\n" +
            "# Geben Sie hier den Startzustand an.             \n" +
            "start_state = \tq_0\n" +
            "\n" +
            "# Geben Sie hier die akzeptierenden Zustände an.\n" +
            "acc_states = \tq_e";

        let tm: TuringMachine = constructFromString(target);
        this.tmRendererService.render(tm);
    }

    public fileHandleChanged(event: any): void {
        let file: File = event.target.files[0];
        if (file) {
            console.log(file);
            let reader: FileReader = new FileReader();
            reader.onload = (e) => {
                let target: any = e.target;
                let data: string = target.result;

                let tm: TuringMachine = constructFromString(data);
            };

            reader.readAsText(file);
        }
    }

}
