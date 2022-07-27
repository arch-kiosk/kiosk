from pdfrw import PdfReader, PdfWriter, PdfObject, PdfDict, PdfName
from datetime import date

ANNOT_KEY = '/Annots'
ANNOT_FIELD_KEY = '/T'
ANNOT_VAL_KEY = '/V'
ANNOT_RECT_KEY = '/Rect'
SUBTYPE_KEY = '/Subtype'
WIDGET_SUBTYPE_KEY = '/Widget'

input_file = r"D:\ustp\Copy of Example_Context_Sheets_Vacone.pdf"
output_file = r"D:\ustp\Copy of Example_Context_Sheets_Vacone_out.pdf"


data_dict = {
    'site_code': 'VAC1',
    'trench': 'TR1',
    'conftext': '123-2',
    'created': date.today(),
    'modified_by': 'lkh',
    'description': """Äußerst umlautlastiges Gewürzmöbel. Muro SW de la trinchera LA. También enyesado y pintado como los demás.
    La ventana comienza aproximadamente a un tercio del camino hacia arriba desde el piso y continúa hasta justo debajo del techo.
    La pared está oscurecida en su lado derecho por una cosa de ubicación de estantes (sin número de contexto todavía, agréguelo más tarde cuando lo tenga).
    Incluye en outlet. 15.5 pasos de LOGS de largo. Conectado a las paredes LA-001 y LA-003 (no está claro cómo). SW wall of trench LA. Also plastered and painted like the others. 
    Window starts about a third of the way up from the floor and continues until just below the ceiling. 
    The wall is obscured on its right side by a shelf emplacement thing (no context number yet, add later when you have it). 
    Includes an outlet. 15.5 LOGS steps long. Connected to walls LA-001 and LA-003 (unclear how)."""
}

if __name__ == '__main__':
    print("starting...")
