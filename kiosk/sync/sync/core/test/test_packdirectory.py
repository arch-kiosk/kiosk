# written by Gemini and LeChat together. They were giving each other hints and this came out
# In a few years I guess all I will do is tell them what I want and I just copy and paste.

import os
import pytest
from packdirectory import FileCollector, pack_directory
from test.testhelpers import KioskPyTestHelper


class TestPackDirectory(KioskPyTestHelper):

    def test_hierarchical_ignore_logic(self, tmp_path,):
        """
        Tests that:
        1. Root rules apply globally.
        2. Subdirectory rules apply locally.
        3. Negation rules (!) correctly restore files.
        4. .packignore files are excluded.
        """
        source = os.path.join(str(tmp_path), "project")
        os.makedirs(source)

        # Root setup
        with open(os.path.join(source, "main.py"), "w") as f: f.write("ok")
        with open(os.path.join(source, ".packignore"), "w") as f:
            f.write("*.log\nignore_me/")

        # Subdirectory with negation override
        data_dir = os.path.join(source, "data")
        os.makedirs(data_dir)
        with open(os.path.join(data_dir, ".packignore"), "w") as f:
            f.write("!important.log")
        with open(os.path.join(data_dir, "app.log"), "w") as f: f.write("skip")
        with open(os.path.join(data_dir, "important.log"), "w") as f: f.write("keep")

        collector = FileCollector(source)
        results = collector.collect_files()

        assert "main.py" in results
        assert "data/important.log" in results
        assert "data/app.log" not in results
        assert "data/.packignore" not in results

    def test_empty_directory_edge_cases(self, tmp_path):
        """
        Verify that a directory containing ONLY ignored files
        is treated as empty.
        """
        source = os.path.join(str(tmp_path), "empty_logic")
        os.makedirs(source)

        # Root rule to ignore all logs
        with open(os.path.join(source, ".packignore"), "w") as f:
            f.write("*.log")

        # Case A: Dir with only a .packignore
        dir_a = os.path.join(source, "only_ignore")
        os.makedirs(dir_a)
        with open(os.path.join(dir_a, ".packignore"), "w") as f:
            f.write("# empty")

        # Case B: Dir with an ignored file
        dir_b = os.path.join(source, "ignored_content")
        os.makedirs(dir_b)
        with open(os.path.join(dir_b, "debug.log"), "w") as f:
            f.write("ignore me")

        collector = FileCollector(source)
        results = collector.collect_files(include_empty_directories=True)

        assert "ignored_content/debug.log" not in results
        assert "only_ignore/" in results
        assert "ignored_content/" in results

    def test_deep_pruning(self, tmp_path):
        """Verify that pruning actually stops us from seeing files in ignored folders."""
        source = os.path.join(str(tmp_path), "prune_test")
        os.makedirs(source)
        with open(os.path.join(source, ".packignore"), "w") as f:
            f.write("secret_dir/")

        secret = os.path.join(source, "secret_dir")
        os.makedirs(secret)
        with open(os.path.join(secret, "top_secret.txt"), "w") as f:
            f.write("hidden")

        collector = FileCollector(source)
        results = collector.collect_files()

        # Ensure the file inside the ignored dir is NOT found
        assert not any("secret_dir" in r for r in results)

    def test_pack_directory_wrapper(self, tmp_path):
        """Test the full flow from directory to ZIP file."""
        source = os.path.join(str(tmp_path), "src")
        os.makedirs(source)
        output_zip = os.path.join(str(tmp_path), "out.zip")

        with open(os.path.join(source, "test.txt"), "w") as f:
            f.write("content")

        count = pack_directory(source, output_zip)

        assert os.path.exists(output_zip)
        assert count == 1

    def test_path_normalization_on_windows(self, tmp_path):
        """Ensures that even on Windows, internal ZIP paths use forward slashes."""
        source = os.path.join(str(tmp_path), "win_test")
        nested = os.path.join(source, "sub", "folder")
        os.makedirs(nested)
        with open(os.path.join(nested, "file.txt"), "w") as f:
            f.write("data")

        collector = FileCollector(source)
        results = collector.collect_files()

        # Result should be POSIX style
        assert "sub/folder/file.txt" in results
        # Result should NOT contain backslashes
        assert "\\" not in results[0]


    def test_selective_walk_respects_root_rules(self, tmp_path):
        source = os.path.join(str(tmp_path), "root")
        os.makedirs(source)

        # 1. Root rule
        with open(os.path.join(source, ".packignore"), "w") as f:
            f.write("*.secret")

        # 2. Deep folder we want to pack
        sub = os.path.join(source, "deep", "folder")
        os.makedirs(sub)
        with open(os.path.join(sub, "keep.txt"), "w") as f: f.write("ok")
        with open(os.path.join(sub, "trash.secret"), "w") as f: f.write("hide")

        collector = FileCollector(source)
        # 3. Only walk the deep folder
        results = collector.collect_files(limit_to_dirs=[sub])

        # If this passes, the root rule was successfully applied!
        assert "deep/folder/keep.txt" in results
        assert "deep/folder/trash.secret" not in results

    def test_selective_packing_with_root_rules(self, tmp_path):
        """
        Prove that limit_to_dirs still respects rules from the parent source_dir.
        """
        source = os.path.join(str(tmp_path), "project")
        os.makedirs(source)

        # 1. Global ignore rule in the root
        with open(os.path.join(source, ".packignore"), "w") as f:
            f.write("*.secret")

        # 2. Deep folder we want to pack specifically
        sub_dir = os.path.join(source, "data", "configs")
        os.makedirs(sub_dir)
        with open(os.path.join(sub_dir, "public.txt"), "w") as f: f.write("ok")
        with open(os.path.join(sub_dir, "private.secret"), "w") as f: f.write("hide")

        collector = FileCollector(source)
        # 3. Only walk the configs folder
        results = collector.collect_files(limit_to_dirs=[sub_dir])

        assert "data/configs/public.txt" in results
        assert "data/configs/private.secret" not in results  # Root rule must still apply

    def test_anchored_ignore_scoping(self, tmp_path):
        """
        Verify that a rule starting with / in a subfolder only
        applies to that specific folder level.
        """
        source = os.path.join(str(tmp_path), "anchor_test")
        os.makedirs(source)

        sub = os.path.join(source, "sub")
        os.makedirs(sub)
        # Anchor the ignore to 'sub/target.txt'
        with open(os.path.join(sub, ".packignore"), "w") as f:
            f.write("/target.txt")

        # This one should be ignored
        with open(os.path.join(sub, "target.txt"), "w") as f: f.write("ignore")
        # This one should be KEPT (it's deeper than the anchor)
        deep = os.path.join(sub, "nested")
        os.makedirs(deep)
        with open(os.path.join(deep, "target.txt"), "w") as f: f.write("keep")

        collector = FileCollector(source)
        results = collector.collect_files()

        assert "sub/target.txt" not in results
        assert "sub/nested/target.txt" in results

    def test_empty_directory_normalization(self, tmp_path):
        """Ensure empty directories get a trailing slash even if found via selective walk."""
        source = os.path.join(str(tmp_path), "empty_norm")
        os.makedirs(source)
        empty = os.path.join(source, "A", "B")
        os.makedirs(empty)

        collector = FileCollector(source)
        results = collector.collect_files(include_empty_directories=True)

        assert "A/B/" in results
        assert results[0].endswith("/")

    def test_path_outside_source_is_ignored(self, tmp_path):
        """Security check: Collector should refuse to walk paths outside source_dir."""
        source = os.path.join(str(tmp_path), "safe_zone")
        os.makedirs(source)

        outside = os.path.join(str(tmp_path), "danger_zone")
        os.makedirs(outside)
        with open(os.path.join(outside, "stolen.txt"), "w") as f: f.write("secret")

        collector = FileCollector(source)
        results = collector.collect_files(limit_to_dirs=[outside])

        assert len(results) == 0

    def test_selective_duplicate_handling(self, tmp_path):
        """Ensure that overlapping limit_to_dirs don't create duplicate entries."""
        source = os.path.join(str(tmp_path), "dup_test")
        os.makedirs(source)
        with open(os.path.join(source, "file.txt"), "w") as f: f.write("data")

        collector = FileCollector(source)
        # Passing the same dir twice
        results = collector.collect_files(limit_to_dirs=[source, source])

        assert results == ["file.txt"]  # set() should have collapsed them

    def test_mandatory_rules_applied_by_default(self, tmp_path):
        """
        Verify that even with NO base_rules passed and NO .packignore file,
        the hard-coded MANDATORY_RULES are still enforced.
        """
        source = os.path.join(str(tmp_path), "mandatory_test")
        os.makedirs(source)

        # 1. Create a "good" file
        with open(os.path.join(source, "app.js"), "w") as f:
            f.write("console.log('hello');")

        # 2. Create files/folders that SHOULD be caught by MANDATORY_RULES
        # Testing a file rule (*.js.map)
        with open(os.path.join(source, "app.js.map"), "w") as f:
            f.write("{}")

        # Testing a directory rule (node_modules/)
        node_dir = os.path.join(source, "node_modules")
        os.makedirs(node_dir)
        with open(os.path.join(node_dir, "package.json"), "w") as f:
            f.write("{}")

        # Testing a hidden IDE folder (.vscode/)
        vscode_dir = os.path.join(source, ".vscode")
        os.makedirs(vscode_dir)
        with open(os.path.join(vscode_dir, "settings.json"), "w") as f:
            f.write("{}")

        # Initialize collector WITHOUT passing any base_rules
        collector = FileCollector(source)
        results = collector.collect_files()

        # Assertions
        assert "app.js" in results
        assert "app.js.map" not in results  # Should be caught by *.js.map
        assert "node_modules/package.json" not in results  # Should be pruned
        assert ".vscode/settings.json" not in results  # Should be pruned

    def test_mandatory_rules_combined_with_local_ignore(self, tmp_path):
        """
        Verify that mandatory rules and .packignore rules work together.
        """
        source = os.path.join(str(tmp_path), "combined_test")
        os.makedirs(source)

        # Mandatory file
        with open(os.path.join(source, "debug.log"), "w") as f: f.write("log")
        # Local ignore file
        with open(os.path.join(source, ".packignore"), "w") as f:
            f.write("*.log")

        # Mandatory rule file
        with open(os.path.join(source, "exclude.pyc"), "w") as f: f.write("binary")

        collector = FileCollector(source)
        results = collector.collect_files()

        assert "debug.log" not in results  # Caught by .packignore
        assert "exclude.pyc" not in results  # Caught by MANDATORY_RULES


    def test_result_folder_shell_preserved(self, tmp_path):
        """
        Test the 'result/*' pattern:
        - Contents of 'result' should be ignored.
        - The 'result/' directory itself should be included as an empty entry.
        """
        source = os.path.join(str(tmp_path), "shell_test")
        os.makedirs(source)

        # 1. Setup the folder and a 'trash' file
        result_path = os.path.join(source, "result")
        os.makedirs(result_path)
        with open(os.path.join(result_path, "temporary_output.log"), "w") as f:
            f.write("I should not be in the zip")

        # 2. Define the rule in .packignore
        # result/* matches all files inside, but not the directory 'result' itself
        with open(os.path.join(source, ".packignore"), "w") as f:
            f.write("result/*\n")

        collector = FileCollector(source)

        # 3. Collect with include_empty_directories=True
        results = collector.collect_files(include_empty_directories=True)

        # Verification
        assert "result/" in results, "The folder shell should be present"
        assert "result/temporary_output.log" not in results, "The folder contents should be ignored"

        # Double check that we don't have duplicates like 'result' and 'result/'
        assert len([r for r in results if r.startswith("result")]) == 1

    def test_single_file_inclusion_with_rules(self, tmp_path):
        source = os.path.join(str(tmp_path), "single_file_test")
        os.makedirs(source)

        valid_file = os.path.join(source, "allowed.txt")
        # Use .js.map because it is explicitly in your MANDATORY_RULES
        ignored_file = os.path.join(source, "secret.js.map")

        with open(valid_file, "w") as f: f.write("ok")
        with open(ignored_file, "w") as f: f.write("hide me")

        collector = FileCollector(source)

        # Pass both as explicit targets
        results = collector.collect_files(limit_to_dirs=[valid_file, ignored_file])

        assert "allowed.txt" in results
        assert "secret.js.map" not in results, "Mandatory .js.map rule should have blocked this."