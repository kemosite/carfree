<?php

/*
 * [MYSQL SAMPLE] *
 INSERT INTO  `geoiplite2`.`geoiplite2-city-blocks` (
`geoname_id` ,
`continent_code`
)
VALUES (
'1',  '1'
), (
'2',  '2'
);
 */
$row = 0;

if (($handle = fopen("GeoLite2-City-CSV\GeoLite2-City-CSV_20140204\GeoLite2-City-Blocks.csv", "r")) !== FALSE) {
	
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		
		if ($row === 0) {
			
			// Insert Into...

			$sql_stmt = 'INSERT INTO `geolite2`.`geolite2-city-blocks` (';

			while (list($key, $field) = each($data)) {
				
				$sql_stmt .= '`'.$field.'`';

				if (current($data)) {
					$sql_stmt .= ', ';					
				}

			}

			$sql_stmt .= ')'."\n";

		} else {

			/* [IF CONTINUING, SEPARATE VALUE LINES] */
			if ($row > 1) { $sql_stmt .= ', '."\n"; }

			// Insert Values...

			$count = count($data) - 1;

			$sql_stmt .= 'VALUES (';

			while (list($key, $field) = each($data)) {

				$sql_stmt .= "'".$field."'";

				if ($key < $count) {
					$sql_stmt .= ', ';					
				}

			}

			$sql_stmt .= ')';

		}

		$row++;

		/*
		$num = count($data);
        echo "<p> $num fields in line $row: <br /></p>\n";
        $row++;
        */

        /*for ($c=0; $c < $num; $c++) {
            echo $data[$c] . "<br />\n";
        }
        */
    }

    fclose($handle);

    echo "<pre>";
    print_r($sql_stmt);
    echo "</pre>";

}

?>