__command() -> (
    print(format('w Usage: /place <max width> <max height>'));
);

place(width, height) -> (
    origin = pos(player());
	
	item_groups = {{json}};
    
    loop(height,
        y = _;
        loop(width,
            z = _;
			i = y * width + z;
			if (i >= length(item_groups), break());
            pos1 = origin + [0, y, z];
            pos2 = origin + [1, y, z];
            set(pos1, 'chest[facing=north,type=left]');
            set(pos2, 'chest[facing=north,type=right]');
			
			items = item_groups:i;			
			for(items,
				inventory_set(pos1, _i, 64, _);
			);
        );
    );
)