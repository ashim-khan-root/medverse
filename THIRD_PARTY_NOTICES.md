# Third-Party Notices

MedVerse is a student, non-commercial health-education project. It uses the
following open-source software and open data. Each item remains under its own
licence; nothing here changes those terms.

## Software

| Component | Licence | Source |
|---|---|---|
| Next.js | MIT | https://nextjs.org/ |
| React / React DOM | MIT | https://react.dev/ |
| Tailwind CSS | MIT | https://tailwindcss.com/ |
| Leaflet | BSD-2-Clause | https://leafletjs.com/ |
| react-leaflet | MIT | https://react-leaflet.js.org/ |
| Lucide icons | ISC | https://lucide.dev/ |
| Nunito (Google Fonts) | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Nunito |
| clsx | MIT | https://github.com/lukeed/clsx |
| tailwind-merge | MIT | https://github.com/dcastil/tailwind-merge |
| class-variance-authority | Apache-2.0 | https://cva.style/ |

## Data

| Source | Licence / terms | Used for |
|---|---|---|
| openFDA drug label API | Public domain (US government work) | General medicine label sections |
| OpenStreetMap | ODbL 1.0 — © OpenStreetMap contributors | Nearby pharmacy/clinic/hospital data and map tiles |
| Nominatim | OpenStreetMap data under ODbL; usage policy applies | City/area geocoding |
| Overpass API | OpenStreetMap data under ODbL | Querying nearby places |

## Illustrations

All illustrations in `components/illustrations.tsx` and the body diagram in
`components/body-diagram.tsx` were drawn for this project as inline SVG. They are
released with the project under the same licence as the project.

If you replace them with third-party artwork (for example unDraw), add the source,
licence, and any required attribution here **before** publishing.

## Attribution in the interface

- The map displays "© OpenStreetMap contributors" via Leaflet's attribution
  control, as required by the ODbL.
- Medicine results link back to the openFDA data source.
