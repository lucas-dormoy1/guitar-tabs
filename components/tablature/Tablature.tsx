import { useMemo, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import Svg from "react-native-svg";

import { styles } from "../../styles/tablature.styles";
import { dimensionsTablature, LARGEUR_MAX } from "../../theme/tablature";
import type { PositionMesure, Section } from "../../types/chanson";
import { calculerLayout } from "../../utils/layoutTablature";
import { Systeme } from "./Systeme";

type Props = {
  sections: Section[];
  accordage: string[];
  echelle: number;
  selection?: PositionMesure | null;
  onMesure?: (indexSection: number, indexMesure: number) => void;
};

export function Tablature({ sections, accordage, echelle, selection, onMesure }: Props) {
  const [largeurConteneur, setLargeurConteneur] = useState(0);
  const dims = useMemo(() => dimensionsTablature(echelle), [echelle]);
  const largeur = Math.min(largeurConteneur, LARGEUR_MAX);
  const layout = useMemo(
    () => (largeur > 0 ? calculerLayout(sections, largeur, dims) : null),
    [sections, largeur, dims]
  );

  const mesurer = (evenement: LayoutChangeEvent) => {
    setLargeurConteneur(evenement.nativeEvent.layout.width);
  };

  return (
    <View style={styles.conteneur} onLayout={mesurer}>
      {layout ? (
        <Svg width={layout.largeurTotale} height={layout.hauteurTotale}>
          {layout.systemes.map((systeme, index) => (
            <Systeme
              key={index}
              systeme={systeme}
              accordage={accordage}
              dims={dims}
              selection={selection}
              onMesure={onMesure}
            />
          ))}
        </Svg>
      ) : null}
    </View>
  );
}
