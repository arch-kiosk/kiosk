def register_custom_rgx(caller):
    caller.register_string2date_rgx("guess",
                                    r"""\s*(?P<guess>.*)\s*""")
    caller.register_string2date_rgx("ddmm(yyyy)",
                                    r"""\s*(?P<day>[0-9]{1,2})\s*[-_./\s]\s*(?P<month>[0-9]{1,2})(\s*[-_./\s]\s*(?P<year>[0-9]{2,4}))?\s*""")
    caller.register_string2date_rgx("ddXX(yyyy)",
                                    r"""\s*(?P<day>[0-9]{1,2})\s*[-_./\s]\s*(?P<month>XII|XI|X|IX|IV|V?I{0,3})(\s*[-_./\s]\s*(?P<year>[0-9]{2,4}))?\s*""")
    caller.register_string2date_rgx("(yyyy)",
                                    r"""^\s*(?P<year>[0-9]{4})\s*$""")

    caller.register_string2identifier_rgx("identifier",
                                          r"""^\s*(?P<identifier>[A-z0-9-_]*)($|\s+)(?P<description>[\S].*?)?\s*$""")
