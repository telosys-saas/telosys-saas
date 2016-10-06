package org.telosys.saas.util;

import org.telosys.saas.domain.FolderToDownload;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * http://www.mkyong.com/java/how-to-compress-files-in-zip-format/
 */
public class Zip {
    static final int BUFFER = 2048;

    public static void zip(String input, String output, FolderToDownload folderToDownload) {
        try {
            FileOutputStream dest = new FileOutputStream(output);
            ZipOutputStream out = new ZipOutputStream(dest);
            List<String> files = new ArrayList<>();
            File f = new File(input);
            for (String sub : f.list()) {
                if ((sub.contains("TelosysTools") && folderToDownload.getTelosysFolder()) || (!sub.contains("TelosysTools") && folderToDownload.getGeneratedFiles())) {
                    files.add(FileUtil.join(input, sub));
                }
            }
            byte data[] = new byte[BUFFER];
            BufferedInputStream origin;
            int i = 0;
            while (i < files.size()) {
                String filePath = files.get(i);
                String fileRelativePath = filePath.substring(input.length() + File.separator.length());
                System.out.println("Adding: " + filePath);
                File file = new File(filePath);
                if (file.isDirectory()) {
                    for (String sub : file.list()) {
                        files.add(FileUtil.join(filePath, sub));
                    }
                }
                if (file.isFile()) {
                    FileInputStream fi = new FileInputStream(filePath);
                    origin = new BufferedInputStream(fi, BUFFER);
                    ZipEntry entry = new ZipEntry(fileRelativePath);
                    out.putNextEntry(entry);
                    int count;
                    while ((count = origin.read(data, 0, BUFFER)) != -1) {
                        out.write(data, 0, count);
                    }
                    out.closeEntry();
                    origin.close();
                }
                i++;
            }
            out.flush();
            out.close();
        } catch (Exception e) {
            throw new IllegalStateException(e);
        } finally {

        }
    }

}