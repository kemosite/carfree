<?php

/*
 * [MYSQL SAMPLE] *
 INSERT INTO  `geolite2`.`geolite2-city-blocks` (
`geoname_id` ,
`continent_code`
)
VALUES (
'0',  '0'
);
 */
$row = 0;

if (($handle = fopen("GeoLite2-City-CSV\GeoLite2-City-CSV_20140204\GeoLite2-City-Locations.csv", "r")) !== FALSE) {
	
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		
		if ($row === 0) {
			
			// Insert Into...

			$sql_stmt = 'INSERT INTO `geolite2`.`geolite2-city-blocks` (';

			foreach($data as $key => $field) {

				$sql_stmt .= '`'.$field.'`, ';

			}

			$sql_stmt .= ')';

			echo $sql_stmt;

			echo '<pre>';
			print_r($data);
			echo '</pre>';

		}

		/*
		echo '<pre>';
		print_r($data);
		echo '</pre>';
		*/

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

}

?>