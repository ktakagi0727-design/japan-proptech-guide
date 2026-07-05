import os

companies = [
    "株式会社フジタ",
    "株式会社豊四季不動産",
    "森トラスト株式会社",
    "住友商事株式会社",
    "清水建設株式会社",
    "ミサワホーム株式会社",
    "三菱地所ハウスネット株式会社",
    "株式会社ES&Company",
    "株式会社アークレスト",
    "株式会社永大ハウス工業"
]

cases_dir = r"c:\Users\ktaka\OneDrive\ドキュメント\会社\japan-proptech-guide\cases"
for comp in companies:
    found = []
    for f in os.listdir(cases_dir):
        if f.endswith('.html'):
            path = os.path.join(cases_dir, f)
            try:
                with open(path, encoding='utf-8') as file:
                    content = file.read()
                    if comp in content:
                        found.append(f)
            except Exception as e:
                pass
    print(f"{comp}: {found}")
