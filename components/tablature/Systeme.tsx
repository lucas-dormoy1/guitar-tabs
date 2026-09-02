import { Fragment } from "react";
import { G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import type { DimensionsTablature } from "../../theme/tablature";
import {
  lettreCorde,
  type Corde,
  type Note,
  type PositionMesure,
  type Technique,
} from "../../types/chanson";
import {
  noteSuivanteSurCorde,
  xPas,
  yCorde,
  type MesurePlacee,
  type SystemePlace,
} from "../../utils/layoutTablature";

const CORDES: Corde[] = [1, 2, 3, 4, 5, 6];

const SYMBOLES: Record<Exclude<Technique, "mute" | "slide-up" | "slide-down">, string> = {
  hammer: "h",
  pull: "p",
  bend: "b",
};

type Props = {
  systeme: SystemePlace;
  accordage: string[];
  dims: DimensionsTablature;
  selection?: PositionMesure | null;
  onMesure?: (indexSection: number, indexMesure: number) => void;
};

function largeurTexte(texte: string, taille: number): number {
  return texte.length * taille * 0.62;
}

function ZoneMesure({
  mesure,
  yHaut,
  yBas,
  dims,
  fill,
  onPress,
}: {
  mesure: MesurePlacee;
  yHaut: number;
  yBas: number;
  dims: DimensionsTablature;
  fill: string;
  onPress?: () => void;
}) {
  return (
    <Rect
      x={mesure.x}
      y={yHaut - dims.espacementCordes * 0.7}
      width={mesure.largeur}
      height={yBas - yHaut + dims.espacementCordes * 1.4}
      fill={fill}
      onPress={onPress}
    />
  );
}

function Frette({
  note,
  x,
  y,
  dims,
}: {
  note: Note;
  x: number;
  y: number;
  dims: DimensionsTablature;
}) {
  const texte = note.technique === "mute" ? "×" : String(note.frette);
  const largeur = largeurTexte(texte, dims.tailleFrette) + dims.tailleFrette * 0.5;

  return (
    <G>
      <Rect
        x={x - largeur / 2}
        y={y - dims.tailleFrette * 0.62}
        width={largeur}
        height={dims.tailleFrette * 1.24}
        fill={colors.tabPapier}
      />
      <SvgText
        x={x}
        y={y + dims.tailleFrette * 0.36}
        fontSize={dims.tailleFrette}
        fontFamily={fonts.semiBold}
        fill={colors.tabFrette}
        textAnchor="middle"
      >
        {texte}
      </SvgText>
    </G>
  );
}

function Liaison({
  technique,
  x1,
  x2,
  y,
  largeurPas,
  dims,
}: {
  technique: Technique;
  x1: number;
  x2: number;
  y: number;
  largeurPas: number;
  dims: DimensionsTablature;
}) {
  const milieu = (x1 + x2) / 2;

  if (technique === "slide-up" || technique === "slide-down") {
    const ecart = Math.min((x2 - x1) / 2, largeurPas * 0.45);
    const hauteur = dims.espacementCordes * 0.3;
    const montant = technique === "slide-up";

    return (
      <Line
        x1={milieu - ecart}
        y1={montant ? y + hauteur : y - hauteur}
        x2={milieu + ecart}
        y2={montant ? y - hauteur : y + hauteur}
        stroke={colors.tabTechnique}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    );
  }

  if (technique === "mute") {
    return null;
  }

  const symbole = SYMBOLES[technique];
  const largeur = largeurTexte(symbole, dims.tailleTechnique) + dims.tailleTechnique * 0.6;

  return (
    <G>
      <Rect
        x={milieu - largeur / 2}
        y={y - dims.tailleTechnique * 0.62}
        width={largeur}
        height={dims.tailleTechnique * 1.24}
        fill={colors.tabPapier}
      />
      <SvgText
        x={milieu}
        y={y + dims.tailleTechnique * 0.34}
        fontSize={dims.tailleTechnique}
        fontFamily={fonts.medium}
        fill={colors.tabTechnique}
        textAnchor="middle"
      >
        {symbole}
      </SvgText>
    </G>
  );
}

function Mesure({
  mesure,
  systeme,
  dims,
  premiere,
}: {
  mesure: MesurePlacee;
  systeme: SystemePlace;
  dims: DimensionsTablature;
  premiere: boolean;
}) {
  const yHaut = yCorde(systeme, 1, dims);
  const yBas = yCorde(systeme, 6, dims);

  return (
    <G>
      <Line
        x1={mesure.x}
        y1={yHaut}
        x2={mesure.x}
        y2={yBas}
        stroke={colors.tabBarreMesure}
        strokeWidth={dims.epaisseurBarre}
      />
      {premiere ? (
        <SvgText
          x={mesure.x + dims.padMesure * 0.4}
          y={yHaut - dims.tailleNumeroMesure * 0.6}
          fontSize={dims.tailleNumeroMesure}
          fontFamily={fonts.medium}
          fill={colors.tabNumeroMesure}
        >
          {mesure.numero}
        </SvgText>
      ) : null}
      {mesure.notes.map((note, index) => {
        const x = xPas(mesure, note.pas, dims);
        const y = yCorde(systeme, note.corde, dims);
        const suivante = note.technique ? noteSuivanteSurCorde(mesure, note) : null;

        return (
          <Fragment key={`${note.corde}-${note.pas}-${index}`}>
            {note.technique && suivante ? (
              <Liaison
                technique={note.technique}
                x1={x}
                x2={xPas(mesure, suivante.pas, dims)}
                y={y}
                largeurPas={mesure.largeurPas}
                dims={dims}
              />
            ) : null}
            <Frette note={note} x={x} y={y} dims={dims} />
          </Fragment>
        );
      })}
    </G>
  );
}

export function Systeme({ systeme, accordage, dims, selection, onMesure }: Props) {
  const yHaut = yCorde(systeme, 1, dims);
  const yBas = yCorde(systeme, 6, dims);
  const xFin = systeme.largeur;
  const avecReprise = systeme.repetitions > 1;

  const selectionnee = (mesure: MesurePlacee) =>
    selection?.section === mesure.indexSection && selection.mesure === mesure.indexMesure;

  return (
    <G>
      {systeme.mesures
        .filter(selectionnee)
        .map((mesure) => (
          <ZoneMesure
            key={mesure.numero}
            mesure={mesure}
            yHaut={yHaut}
            yBas={yBas}
            dims={dims}
            fill={colors.tabSelection}
          />
        ))}

      {systeme.nomSection ? (
        <SvgText
          x={0}
          y={systeme.y + dims.tailleLabelSection}
          fontSize={dims.tailleLabelSection}
          fontFamily={fonts.bold}
          fill={colors.tabLabel}
        >
          {systeme.nomSection.toUpperCase()}
        </SvgText>
      ) : null}

      {CORDES.map((corde) => {
        const y = yCorde(systeme, corde, dims);
        return (
          <Fragment key={corde}>
            <Line
              x1={dims.largeurEnTete}
              y1={y}
              x2={xFin}
              y2={y}
              stroke={corde >= 5 ? colors.tabCordeGrave : colors.tabCorde}
              strokeWidth={dims.epaisseurCorde}
            />
            <SvgText
              x={dims.largeurEnTete - dims.tailleEnTete * 0.7}
              y={y + dims.tailleEnTete * 0.36}
              fontSize={dims.tailleEnTete}
              fontFamily={fonts.medium}
              fill={colors.textFaint}
              textAnchor="end"
            >
              {lettreCorde(accordage, corde)}
            </SvgText>
          </Fragment>
        );
      })}

      {systeme.mesures.map((mesure, index) => (
        <Mesure
          key={mesure.numero}
          mesure={mesure}
          systeme={systeme}
          dims={dims}
          premiere={index === 0}
        />
      ))}

      <Line
        x1={xFin}
        y1={yHaut}
        x2={xFin}
        y2={yBas}
        stroke={systeme.finSection ? colors.tabBarreForte : colors.tabBarreMesure}
        strokeWidth={systeme.finSection ? dims.epaisseurBarre * 1.8 : dims.epaisseurBarre}
      />

      {avecReprise && systeme.debutSection ? (
        <Reprise
          x={dims.largeurEnTete}
          yHaut={yHaut}
          yBas={yBas}
          dims={dims}
          sens="ouvrante"
        />
      ) : null}

      {avecReprise && systeme.finSection ? (
        <>
          <Reprise x={xFin} yHaut={yHaut} yBas={yBas} dims={dims} sens="fermante" />
          <SvgText
            x={xFin - dims.tailleLabelSection * 0.2}
            y={yHaut - dims.tailleNumeroMesure * 0.6}
            fontSize={dims.tailleNumeroMesure * 1.15}
            fontFamily={fonts.semiBold}
            fill={colors.tabLabel}
            textAnchor="end"
          >
            {`×${systeme.repetitions}`}
          </SvgText>
        </>
      ) : null}

      {onMesure
        ? systeme.mesures.map((mesure) => (
            <ZoneMesure
              key={`zone-${mesure.numero}`}
              mesure={mesure}
              yHaut={yHaut}
              yBas={yBas}
              dims={dims}
              fill="transparent"
              onPress={() => onMesure(mesure.indexSection, mesure.indexMesure)}
            />
          ))
        : null}
    </G>
  );
}

function Reprise({
  x,
  yHaut,
  yBas,
  dims,
  sens,
}: {
  x: number;
  yHaut: number;
  yBas: number;
  dims: DimensionsTablature;
  sens: "ouvrante" | "fermante";
}) {
  const direction = sens === "ouvrante" ? 1 : -1;
  const decalage = dims.espacementCordes * 0.22;
  const rayon = Math.max(dims.espacementCordes * 0.11, 1.3);
  const milieu = (yHaut + yBas) / 2;

  return (
    <G>
      <Line
        x1={x + direction * decalage * 1.6}
        y1={yHaut}
        x2={x + direction * decalage * 1.6}
        y2={yBas}
        stroke={colors.tabBarreForte}
        strokeWidth={dims.epaisseurBarre * 2.4}
      />
      <Path
        d={cerclePlein(x + direction * decalage * 3.6, milieu - dims.espacementCordes, rayon)}
        fill={colors.tabBarreForte}
      />
      <Path
        d={cerclePlein(x + direction * decalage * 3.6, milieu + dims.espacementCordes, rayon)}
        fill={colors.tabBarreForte}
      />
    </G>
  );
}

function cerclePlein(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
}
